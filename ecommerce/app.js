import { ConnectionDB, closeConnection } from './database/connection.js';
import Produto from './models/produto.js';
import { logError } from './utils/logger.js'; // 👈 importar

async function main() {
  try {
    await ConnectionDB();
    console.log('Conectado ao banco!');

    const produtoComErro = new Produto({
      descricao: 'Produto sem nome',
      estoque: -5, 
      ativo: true,
      categoria: 'categoria-invalida' 
    });

    await produtoComErro.save(); 

  } catch (error) {
    logError(error); 
    console.error('Erro:', error.message);
  } finally {
    await closeConnection();
    console.log('Conexão fechada!');
  }
}

main();
