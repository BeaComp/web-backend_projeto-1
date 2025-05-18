import { ConnectionDB, closeConnection } from './database/connection.js';
import Cliente from './models/Cliente.js';
import Pedido from './models/Pedido.js';
import Produto from './models/produto.js';
import { logError } from './utils/logger.js';

async function main() {
  try {
    await ConnectionDB();
    console.log('Conectado ao banco!');

    console.log('\nCriando cliente...');
    const cliente = await Cliente.create({
      nome: 'Maria Oliveira',
      email: 'maria@email.com',
      endereco: {
        rua: 'Rua das Flores',
        numero: '100',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      }
    });
    console.log('Cliente criado:', cliente);

    console.log('\nCriando produto...');
    const produto = await Produto.create({
      nome: 'Camisa Polo',
      descricao: 'Camisa polo de algodão',
      preco: 89.90,
      categoria: 'Roupas',
      estoque: 20,
      ativo: true
    });
    console.log('Produto criado:', produto);

    console.log('\nCriando pedido...');
    const pedido = await Pedido.create({
      clienteId: cliente._id,
      produtos: [
        {
          produtoId: produto._id,
          quantidade: 2
        }
      ]
    });
    console.log('Pedido criado:', pedido);

  } catch (error) {
    logError(error);
    console.error('Erro:', error.message);
  } finally {
    await closeConnection();
    console.log('Conexão fechada!');
  }
}

main();
