// index.js
import { ConnectionDB, closeConnection } from './database/connection.js';
import Produto from './models/produto.js'; 

async function main() {
  try {
    await ConnectionDB(); 
    console.log('Conectado ao banco!');
    console.log('tentando cadastrar');
    const novoProduto = new Produto({
      nome: 'Notebook',
      descricao: 'Notebook gamer',
      estoque: 10,
      ativo: true,
    });

    const produtoSalvo = await novoProduto.save();
    console.log('Produto cadastrado:', produtoSalvo);

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await closeConnection();
    console.log('Conexão fechada!');
  }
}

main();
