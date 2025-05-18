// index.js
import { ConnectionDB, closeConnection } from './database/connection.js';
import Produto from './models/produto.js'; 

async function main() {
  try {
    await ConnectionDB(); 
    console.log('Conectado ao banco!');

    const novoProduto = new Produto({
      nome: 'Notebook',
      descricao: 'Notebook gamer',
      estoque: 10,
      ativo: true,
    });

    const produtoSalvo = await novoProduto.save();
    console.log('Produto cadastrado:', produtoSalvo);

    const produtos = await Produto.find();
    console.log('📋 Lista de produtos:');
    produtos.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nome} - Estoque: ${p.estoque} - Ativo: ${p.ativo}`);
    });


    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await closeConnection();
    console.log('Conexão fechada!');
  }
}

main();
