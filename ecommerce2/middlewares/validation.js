export const validateClienteRegistro = (req, res, next) => {
    const { nome, email, senha, endereco } = req.body;
    const errors = [];

    if (!nome || nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('E-mail inválido');
    }

    if (!senha || senha.length < 6) {
        errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!endereco) {
        errors.push('Endereço é obrigatório');
    } else {
        if (!endereco.rua || endereco.rua.trim().length < 3) {
            errors.push('Rua deve ter pelo menos 3 caracteres');
        }
        if (!endereco.numero || endereco.numero.trim().length < 1) {
            errors.push('Número é obrigatório');
        }
        if (!endereco.cidade || endereco.cidade.trim().length < 2) {
            errors.push('Cidade deve ter pelo menos 2 caracteres');
        }
        if (!endereco.estado || endereco.estado.trim().length !== 2) {
            errors.push('Estado deve ter 2 caracteres (ex: SP)');
        }
        if (!endereco.cep || !/^\d{5}-?\d{3}$/.test(endereco.cep)) {
            errors.push('CEP inválido (formato: 12345-678)');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, senha } = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push('E-mail é obrigatório');
    }

    if (!senha || !senha.trim()) {
        errors.push('Senha é obrigatória');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }

    next();
};

export const validateProduto = (req, res, next) => {
    const { nome, descricao, estoque } = req.body;
    const errors = [];

    if (!nome || nome.trim().length < 3) {
        errors.push('Nome do produto deve ter pelo menos 3 caracteres');
    }

    if (descricao && descricao.length > 200) {
        errors.push('Descrição pode ter no máximo 200 caracteres');
    }

    if (estoque !== undefined && (isNaN(estoque) || estoque < 0)) {
        errors.push('Estoque deve ser um número não negativo');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }

    next();
};

export const validatePedido = (req, res, next) => {
    const { produtos } = req.body;
    const errors = [];

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
        errors.push('Lista de produtos é obrigatória');
    } else {
        produtos.forEach((produto, index) => {
            if (!produto.produtoId) {
                errors.push(`Produto ${index + 1}: ID do produto é obrigatório`);
            }
            if (!produto.quantidade || produto.quantidade < 1) {
                errors.push(`Produto ${index + 1}: Quantidade deve ser pelo menos 1`);
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }

    next();
};

export const validateClienteUpdate = (req, res, next) => {
    const { nome, endereco } = req.body;
    const errors = [];

    if (nome && nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (endereco) {
        if (endereco.rua && endereco.rua.trim().length < 3) {
            errors.push('Rua deve ter pelo menos 3 caracteres');
        }
        if (endereco.numero && endereco.numero.trim().length < 1) {
            errors.push('Número é obrigatório');
        }
        if (endereco.cidade && endereco.cidade.trim().length < 2) {
            errors.push('Cidade deve ter pelo menos 2 caracteres');
        }
        if (endereco.estado && endereco.estado.trim().length !== 2) {
            errors.push('Estado deve ter 2 caracteres (ex: SP)');
        }
        if (endereco.cep && !/^\d{5}-?\d{3}$/.test(endereco.cep)) {
            errors.push('CEP inválido (formato: 12345-678)');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors
        });
    }

    next();
};

