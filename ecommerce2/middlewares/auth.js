import Cliente from '../models/Cliente.js';
import { logError } from '../utils/logger.js';

export const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Faça login para continuar.' 
        });
    }
};

export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Acesso negado. Faça login para continuar.' 
            });
        }

        const cliente = await Cliente.findById(req.session.userId);
        
        if (!cliente || !cliente.ativo) {
            return res.status(403).json({ 
                success: false, 
                message: 'Acesso negado.' 
            });
        }

        req.user = cliente;
        next();
    } catch (error) {
        logError(error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
};

export const requireOwnership = (req, res, next) => {
    const resourceUserId = req.params.id || req.params.clienteId;
    
    if (req.session.userId !== resourceUserId) {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Você só pode acessar seus próprios dados.' 
        });
    }
    
    next();
};

export const addUserInfo = async (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            const cliente = await Cliente.findById(req.session.userId);
            if (cliente && cliente.ativo) {
                req.user = cliente;
            }
        }
        next();
    } catch (error) {
        logError(error);
        next();
    }
};

export const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

