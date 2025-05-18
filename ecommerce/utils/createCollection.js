import Cliente from '../models/Cliente.js';
import Produto from '../models/produto.js';
import Pedido from '../models/Pedido.js';
import { logError } from './logger.js';

export async function createInitialData() {
    let cliente, produto;

    // Criar Cliente
    try {
        cliente = new Cliente({
            nome: 'João Silva',
            email: 'joao.silva@example.com',
            endereco: {
                rua: 'Rua das Flores',
                numero: '123',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '01234-567'
            }
        });
        await cliente.save();
        console.log('Cliente criado com sucesso!');
    } catch (error) {
        logError(error);
        console.error('Erro ao criar cliente:', error.message);
    }

    // Criar Produto
    try {
        produto = new Produto({
            nome: 'Notebook',
            descricao: 'Notebook gamer',
            estoque: 10,
            ativo: true
        });
        await produto.save();
        console.log('Produto criado com sucesso!');
    } catch (error) {
        logError(error);
        console.error('Erro ao criar produto:', error.message);
    }

    // Criar Pedido (somente se cliente e produto foram criados)
    if (cliente && produto) {
        try {
            const pedido = new Pedido({
                clienteId: cliente._id,
                produtos: [{ produtoId: produto._id, quantidade: 2 }],
                status: 'pendente'
            });
            await pedido.save();
            console.log('Pedido criado com sucesso!', pedido._id);

            console.log('Atualizando status do pedido para aprovado')
            await updateOrderStatusById(pedido._id)
        } catch (error) {
            logError(error);
            console.error('Erro ao criar pedido:', error.message);
        }
    } else {
        console.error('Pedido não criado: cliente ou produto faltando.');
    }
}

export async function triggerErrors() {

    try {
        const clienteInvalido = new Cliente({});
        await clienteInvalido.save();
    } catch (error) {
        logError(error);
        console.error('Erro Cliente:', error.message);
    }

    try {
        const produtoInvalido = new Produto({
            nome: 'ab',
            descricao: 'x'.repeat(300),
            estoque: -5,
        });
        await produtoInvalido.save();
    } catch (error) {
        logError(error);
        console.error('Erro Produto:', error.message);
    }

    try {
        const pedidoInvalido = new Pedido({
            produtos: [
                {
                    quantidade: 0,
                }
            ]
        });
        await pedidoInvalido.save();
    } catch (error) {
        logError(error);
        console.error('Erro Pedido:', error.message);
    }
}

export async function editClientByEmail(novosDados) {
    const email = 'joao.silva@example.com'
    try {
        const clienteAtualizado = await Cliente.findOneAndUpdate(
            { email },
            { $set: novosDados },
            { new: true }
        );

        if (!clienteAtualizado) {
            console.error(`Cliente com e-mail ${email} não encontrado.`);
            logError(`Cliente com e-mail ${email} não encontrado.`);
            return;
        }

        console.log('Cliente atualizado com sucesso:', clienteAtualizado);
    } catch (error) {
        logError(error);
        console.error('Erro ao atualizar cliente:', error.message);
    }
}

export async function updateOrderStatusById(pedidoId) {
    const novoStatus = 'aprovado'

    try {
        const pedidoAtualizado = await Pedido.findByIdAndUpdate(
            pedidoId,
            { status: novoStatus },
            { new: true }
        );

        if (!pedidoAtualizado) {
            console.error(`Pedido com ID ${pedidoId} não encontrado.`);
            return;
        }

        console.log('Status do pedido atualizado com sucesso:', pedidoAtualizado);
    } catch (error) {
        logError(error);
        console.error('Erro ao atualizar status do pedido:', error.message);
    }
}

export async function searchProductsByName(nome) {
    try {
        const produtos = await Produto.find({
            nome: { $regex: nome, $options: 'i' }
        });

        if (produtos.length === 0) {
            console.log('Nenhum produto encontrado com esse nome.');
        } else {
            console.log(`Foram encontrados ${produtos.length} produto(s):`);
            console.log(produtos);
        }

        return produtos;
    } catch (error) {
        logError(error);
        console.error('Erro ao buscar produtos por nome:', error.message);
        return [];
    }
}