import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { ConnectionDB } from './database/connection.js';
import { logError } from './utils/logger.js';

// Importar rotas
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessões
app.use(session({
    secret: process.env.SESSION_SECRET || 'ecommerce-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Faça login para continuar.' 
        });
    }
};


// Rotas públicas da API
app.use('/api/auth', authRoutes);

// Rotas protegidas da API
app.use('/api/clientes', requireAuth, clienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', requireAuth, pedidoRoutes);

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    logError(error);
    res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Rota não encontrada' 
    });
});

// Inicializar servidor
async function startServer() {
    try {
        await ConnectionDB();
        console.log('Conectado ao banco de dados!');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse: http://localhost:${PORT}`);
        });
    } catch (error) {
        logError(error);
        console.error('Erro ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

startServer();

export default app;

