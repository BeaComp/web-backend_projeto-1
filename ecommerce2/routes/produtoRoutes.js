import express from 'express';
import Produto from '../models/Produto.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, ativo = true } = req.query;
        const skip = (page - 1) * limit;
        console.log(req)
        let query = { ativo: ativo };

        // Busca por nome ou descrição
        if (search) {
            query.$or = [
                { nome: { $regex: search, $options: 'i' } },
                { descricao: { $regex: search, $options: 'i' } }
            ];
        }

        const produtos = await Produto.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ nome: 1 });

        const total = await Produto.countDocuments(query);

        res.json({
            success: true,
            produtos,
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
            message: 'Erro ao buscar produtos'
        });
    }
});

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findById(id);
        if (!produto || !produto.ativo) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            produto
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto'
        });
    }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, estoque } = req.body;

        const novoProduto = new Produto({
            nome,
            descricao,
            estoque
        });

        await novoProduto.save();

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            produto: novoProduto
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao criar produto',
            error: error.message
        });
    }
});

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, estoque } = req.body;

        const dadosAtualizacao = {};
        if (nome !== undefined) dadosAtualizacao.nome = nome;
        if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
        if (estoque !== undefined) dadosAtualizacao.estoque = estoque;

        const produto = await Produto.findByIdAndUpdate(
            id,
            dadosAtualizacao,
            { new: true, runValidators: true }
        );

        if (!produto || !produto.ativo) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            produto
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar produto',
            error: error.message
        });
    }
});

// DELETE /api/produtos/:id - Desativar produto (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByIdAndUpdate(
            id,
            { ativo: false },
            { new: true }
        );

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Produto desativado com sucesso'
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao desativar produto'
        });
    }
});

// POST /api/produtos/buscar-nome - Buscar produtos por nome
router.post('/buscar-nome', async (req, res) => {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                success: false,
                message: 'Nome é obrigatório'
            });
        }

        const produtos = await Produto.find({
            nome: { $regex: nome, $options: 'i' },
            ativo: true
        });

        res.json({
            success: true,
            produtos,
            total: produtos.length
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produtos'
        });
    }
});

// PATCH /api/produtos/:id/estoque - Atualizar apenas o estoque
router.patch('/:id/estoque', async (req, res) => {
    try {
        const { id } = req.params;
        const { estoque } = req.body;

        if (estoque === undefined || estoque < 0) {
            return res.status(400).json({
                success: false,
                message: 'Estoque deve ser um número não negativo'
            });
        }

        const produto = await Produto.findByIdAndUpdate(
            id,
            { estoque },
            { new: true, runValidators: true }
        );

        if (!produto || !produto.ativo) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Estoque atualizado com sucesso',
            produto
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar estoque',
            error: error.message
        });
    }
});

export default router;

