import express from 'express';
import Pedido from '../models/Pedido.js';
import Produto from '../models/Produto.js';
import Cliente from '../models/Cliente.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

// GET /api/pedidos - Listar pedidos do cliente logado
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let query = { clienteId: req.session.userId };
        
        if (status) {
            query.status = status;
        }

        const pedidos = await Pedido.find(query)
            .populate('produtos.produtoId', 'nome descricao')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ dataPedido: -1 });

        const total = await Pedido.countDocuments(query);

        res.json({
            success: true,
            pedidos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar pedidos'
        });
    }
});

// GET /api/pedidos/:id - Buscar pedido específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findOne({
            _id: id,
            clienteId: req.session.userId
        }).populate('produtos.produtoId', 'nome descricao estoque');

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        res.json({
            success: true,
            pedido
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar pedido'
        });
    }
});

// POST /api/pedidos - Criar novo pedido
router.post('/', async (req, res) => {
    try {
        const { produtos } = req.body;

        if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de produtos é obrigatória'
            });
        }

        // Verificar se todos os produtos existem e têm estoque suficiente
        for (const item of produtos) {
            const produto = await Produto.findById(item.produtoId);
            
            if (!produto || !produto.ativo) {
                return res.status(400).json({
                    success: false,
                    message: `Produto ${item.produtoId} não encontrado`
                });
            }

            if (produto.estoque < item.quantidade) {
                return res.status(400).json({
                    success: false,
                    message: `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.estoque}, Solicitado: ${item.quantidade}`
                });
            }
        }

        // Criar o pedido
        const novoPedido = new Pedido({
            clienteId: req.session.userId,
            produtos
        });

        await novoPedido.save();

        // Atualizar estoque dos produtos
        for (const item of produtos) {
            await Produto.findByIdAndUpdate(
                item.produtoId,
                { $inc: { estoque: -item.quantidade } }
            );
        }

        // Buscar o pedido criado com os dados dos produtos
        const pedidoCompleto = await Pedido.findById(novoPedido._id)
            .populate('produtos.produtoId', 'nome descricao');

        res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso',
            pedido: pedidoCompleto
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao criar pedido',
            error: error.message
        });
    }
});

// PUT /api/pedidos/:id/status - Atualizar status do pedido (apenas para admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusValidos = ['pendente', 'aprovado', 'enviado', 'entregue'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('produtos.produtoId', 'nome descricao');

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Status do pedido atualizado com sucesso',
            pedido
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar status do pedido',
            error: error.message
        });
    }
});

// DELETE /api/pedidos/:id - Cancelar pedido (apenas se status for 'pendente')
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findOne({
            _id: id,
            clienteId: req.session.userId
        });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        if (pedido.status !== 'pendente') {
            return res.status(400).json({
                success: false,
                message: 'Apenas pedidos pendentes podem ser cancelados'
            });
        }

        // Restaurar estoque dos produtos
        for (const item of pedido.produtos) {
            await Produto.findByIdAndUpdate(
                item.produtoId,
                { $inc: { estoque: item.quantidade } }
            );
        }

        await Pedido.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Pedido cancelado com sucesso'
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao cancelar pedido'
        });
    }
});

// GET /api/pedidos/admin/todos - Listar todos os pedidos (apenas para admin)
router.get('/admin/todos', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, clienteId } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (clienteId) {
            query.clienteId = clienteId;
        }

        const pedidos = await Pedido.find(query)
            .populate('clienteId', 'nome email')
            .populate('produtos.produtoId', 'nome descricao')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ dataPedido: -1 });

        const total = await Pedido.countDocuments(query);

        res.json({
            success: true,
            pedidos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar pedidos'
        });
    }
});

export default router;

