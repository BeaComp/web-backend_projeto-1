import express from 'express';
import Cliente from '../models/Cliente.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

// POST /api/auth/register - Registrar novo cliente
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, endereco } = req.body;

        // Verificar se o cliente já existe
        const clienteExistente = await Cliente.buscarPorEmail(email);
        if (clienteExistente) {
            return res.status(400).json({
                success: false,
                message: 'E-mail já cadastrado'
            });
        }

        // Criar novo cliente
        const novoCliente = new Cliente({
            nome,
            email,
            senha,
            endereco
        });

        await novoCliente.save();

        // Criar sessão
        req.session.userId = novoCliente._id;
        req.session.userEmail = novoCliente.email;

        res.status(201).json({
            success: true,
            message: 'Cliente registrado com sucesso',
            cliente: novoCliente
        });

    } catch (error) {
        logError(error);
        res.status(400).json({
            success: false,
            message: 'Erro ao registrar cliente',
            error: error.message
        });
    }
});

// POST /api/auth/login - Login do cliente
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'E-mail e senha são obrigatórios'
            });
        }

        // Buscar cliente com senha
        const cliente = await Cliente.buscarPorEmailComSenha(email);
        if (!cliente) {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha inválidos'
            });
        }

        // Verificar senha
        const senhaValida = await cliente.verificarSenha(senha);
        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha inválidos'
            });
        }

        // Criar sessão
        req.session.userId = cliente._id;
        req.session.userEmail = cliente.email;

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            cliente: {
                id: cliente._id,
                nome: cliente.nome,
                email: cliente.email,
                endereco: cliente.endereco
            }
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// POST /api/auth/logout - Logout do cliente
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logError(err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao fazer logout'
            });
        }

        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    });
});

// GET /api/auth/status - Verificar status de autenticação
router.get('/status', (req, res) => {
    res.json({
        success: true,
        authenticated: !!req.session.userId,
        userId: req.session.userId || null
    });
});

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
        }

        const cliente = await Cliente.findById(req.session.userId);
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.json({
            success: true,
            cliente: cliente
        });

    } catch (error) {
        logError(error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

export default router;

