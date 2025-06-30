import Cliente from '../models/Cliente.js';
import Produto from '../models/Produto.js';
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

    try {
        const cliente1 = new Cliente({
            nome: 'Maria Oliveira',
            email: 'maria.oliveira@example.com',
            endereco: {
                rua: 'Avenida Central',
                numero: '456',
                cidade: 'Rio de Janeiro',
                estado: 'RJ',
                cep: '12345-678'
            }
        });
        await cliente1.save();
        console.log('Cliente criado com sucesso!');
    } catch (error) {
        logError(error);
        console.error('Erro ao criar cliente 1:', error.message);
    }

    try {
        const cliente2 = new Cliente({
            nome: 'Carlos Pereira',
            email: 'carlos.pereira@example.com',
            endereco: {
                rua: 'Rua do Comércio',
                numero: '789',
                cidade: 'Belo Horizonte',
                estado: 'MG',
                cep: '23456-789'
            }
        });
        await cliente2.save();
        console.log('Cliente criado com sucesso!');
    } catch (error) {
        logError(error);
        console.error('Erro ao criar cliente 2:', error.message);
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

    try {
        produto = new Produto({
            nome: 'Notebook positivo',
            descricao: 'Notebook gamer super poderoso',
            estoque: 100,
            ativo: true
        });
        await produto.save();
        console.log('Produto criado com sucesso!');
    } catch (error) {
        logError(error);
        console.error('Erro ao criar produto:', error.message);
    }

    try {
        produto = new Produto({
            nome: 'Monitor xaing',
            descricao: 'Monitor 8k full hd',
            estoque: 100,
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

export async function searchCustomerByEmail(email) {
  try {
    const cliente = await Cliente.findOne({ email });
    if (cliente) {
      console.log('Cliente encontrado:', cliente);
    } else {
      console.log('Nenhum cliente encontrado com esse e-mail.');
    }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error.message);
  }
}

export async function deleteClientByEmail(email) {
  try {
    const resultado = await Cliente.findOneAndDelete({ email });
    if (resultado) {
      console.log('Cliente excluído com sucesso:', resultado);
    } else {
      console.log('Cliente não encontrado para exclusão.');
    }
  } catch (error) {
    console.error('Erro ao excluir cliente:', error.message);
  }
}

export async function editProductByName(nome, novosDados) {
  try {
    const produtoAtualizado = await Produto.findOneAndUpdate(
      { nome },
      novosDados,
      { new: true } // Retorna o produto atualizado
    );

    if (produtoAtualizado) {
      console.log('Produto atualizado com sucesso:', produtoAtualizado);
      return produtoAtualizado;
    } else {
      console.log('Produto não encontrado para atualização.');
      return null;
    }
  } catch (error) {
    logError(error);
    console.error('Erro ao atualizar produto:', error.message);
  }
}

export async function deleteProductByName(nome) {
  try {
    const produtoExcluido = await Produto.findOneAndDelete({ nome });

    if (produtoExcluido) {
      console.log('Produto excluído com sucesso:', produtoExcluido);
      return produtoExcluido;
    } else {
      console.log('Produto não encontrado para exclusão.');
      return null;
    }
  } catch (error) {
    logError(error);
    console.error('Erro ao excluir produto:', error.message);
  }
}
