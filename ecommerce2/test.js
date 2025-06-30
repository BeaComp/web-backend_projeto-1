import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Função para tentar converter resposta em JSON (com fallback seguro)
async function tryParseJSON(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function testarAPI() {
    console.log('Iniciando testes da API E-commerce...\n');

    try {
        // Teste 1: Verificar se o servidor está rodando (sem tentar fazer .json() em HTML)
        console.log('1. Testando conexão com o servidor...');
        const response = await fetch(`${BASE_URL}/api/auth/me`); // rota mais confiável
        if (response.ok || response.status === 401) {
            console.log('Servidor está online e respondendo.');
        } else {
            console.log('Servidor respondeu, mas com status inesperado:', response.status);
        }
        console.log('');

        // Teste 2: Registrar um novo cliente
        console.log('2. Testando registro de cliente...');
        const novoCliente = {
            nome: 'João Silva Teste',
            email: 'joao.teste@email.com',
            senha: '123456',
            endereco: {
                rua: 'Rua das Flores',
                numero: '123',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '01234-567'
            }
        };

        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoCliente)
        });

        if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            console.log('Cliente registrado com sucesso:', registerData.cliente.nome);
        } else {
            const errorData = await tryParseJSON(registerResponse);
            console.log('Erro no registro:', errorData?.message || 'Erro desconhecido');
        }
        console.log('');

        // Teste 3: Fazer login
        console.log('3. Testando login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'joao.teste@email.com',
                senha: '123456'
            })
        });

        let sessionCookie = '';
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('Login realizado com sucesso:', loginData.cliente.nome);

            const cookies = loginResponse.headers.get('set-cookie');
            if (cookies) {
                sessionCookie = cookies.split(';')[0];
            } else {
                console.warn('Cookie de sessão não encontrado');
            }
        } else {
            const errorData = await tryParseJSON(loginResponse);
            console.log('Erro no login:', errorData?.message || 'Erro desconhecido');
            return;
        }
        console.log('');

        // Teste 4: Criar um produto
        console.log('4. Testando criação de produto...');
        const novoProduto = {
            nome: 'Notebook Dell Teste',
            descricao: 'Notebook Dell Inspiron 15 para testes',
            estoque: 5
        };

        const produtoResponse = await fetch(`${BASE_URL}/api/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
            },
            body: JSON.stringify(novoProduto)
        });

        let produtoId = '';
        if (produtoResponse.ok) {
            const produtoData = await produtoResponse.json();
            console.log('Produto criado com sucesso:', produtoData.produto.nome);
            produtoId = produtoData.produto._id;
        } else {
            const errorData = await tryParseJSON(produtoResponse);
            console.log('Erro ao criar produto:', errorData?.message || 'Erro desconhecido');
        }
        console.log('');

        // Teste 5: Listar produtos
        console.log('5. Testando listagem de produtos...');
        const listaProdutosResponse = await fetch(`${BASE_URL}/api/produtos`);
        if (listaProdutosResponse.ok) {
            const listaProdutos = await listaProdutosResponse.json();
            console.log('Produtos listados:', listaProdutos.produtos.length, 'produtos encontrados');
        } else {
            console.log('Erro ao listar produtos');
        }
        console.log('');

        // Teste 6: Criar um pedido (se temos produto)
        if (produtoId) {
            console.log('6. Testando criação de pedido...');
            const novoPedido = {
                produtos: [
                    {
                        produtoId: produtoId,
                        quantidade: 2
                    }
                ]
            };

            const pedidoResponse = await fetch(`${BASE_URL}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': sessionCookie
                },
                body: JSON.stringify(novoPedido)
            });

            if (pedidoResponse.ok) {
                const pedidoData = await pedidoResponse.json();
                console.log('Pedido criado com sucesso, ID:', pedidoData.pedido._id);
            } else {
                const errorData = await tryParseJSON(pedidoResponse);
                console.log('Erro ao criar pedido:', errorData?.message || 'Erro desconhecido');
            }
            console.log('');
        }

        // Teste 7: Verificar dados do usuário logado
        console.log('7. Testando dados do usuário logado...');
        const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { 'Cookie': sessionCookie }
        });

        if (meResponse.ok) {
            const meData = await meResponse.json();
            console.log('Dados do usuário:', meData.cliente.nome, '-', meData.cliente.email);
        } else {
            console.log('Erro ao obter dados do usuário');
        }
        console.log('');

        console.log('Testes concluídos com sucesso!');

    } catch (error) {
        console.error('Erro durante os testes:', error.message);
    }
}

setTimeout(testarAPI, 2000);
