import express from 'express';
import Cliente from '../models/Cliente.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

// GET /api/clientes - Listar todos os clientes (apenas para admin)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        let query = { ativo: true };
        
        // Busca por nome ou email
        if (search) {
            query.$or = [
                { nome: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const clientes = await Cliente.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ dataCriacao: -1 });

        const total = await Cliente.countDocuments(query);

        res.json({
            success: true,
            clientes,
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
            message: 'Erro ao buscar clientes'
        });
    }
});

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o usuário está tentando acessar seus próprios dados
        if (req.session.userId !== id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }

        const cliente = await Cliente.findById(id);
        if (!cliente || !cliente.ativo) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.json({
            success: true,
            cliente
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cliente'
        });
    }
});

// PUT /api/clientes/:id - Atualizar dados do cliente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, endereco } = req.body;

        // Verificar se o usuário está tentando atualizar seus próprios dados
        if (req.session.userId !== id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }

        const dadosAtualizacao = {};
        if (nome) dadosAtualizacao.nome = nome;
        if (endereco) dadosAtualizacao.endereco = endereco;

        const cliente = await Cliente.findByIdAndUpdate(
            id,
            dadosAtualizacao,
            { new: true, runValidators: true }
        );

        if (!cliente || !cliente.ativo) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Cliente atualizado com sucesso',
            cliente
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar cliente',
            error: error.message
        });
    }
});

// DELETE /api/clientes/:id - Desativar cliente (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o usuário está tentando deletar sua própria conta
        if (req.session.userId !== id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }

        const cliente = await Cliente.findByIdAndUpdate(
            id,
            { ativo: false },
            { new: true }
        );

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        // Destruir sessão após desativar conta
        req.session.destroy();

        res.json({
            success: true,
            message: 'Conta desativada com sucesso'
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desativar conta'
        });
    }
});

// POST /api/clientes/buscar-email - Buscar cliente por email
router.post('/buscar-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'E-mail é obrigatório'
            });
        }

        const cliente = await Cliente.buscarPorEmail(email);
        
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.json({
            success: true,
            cliente
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cliente'
        });
    }
});

export default router;

