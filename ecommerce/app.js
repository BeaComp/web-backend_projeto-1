import { ConnectionDB, closeConnection } from './database/connection.js';
import Cliente from './models/Cliente.js';
import Pedido from './models/Pedido.js';
import Produto from './models/produto.js';
import { logError } from './utils/logger.js';
import { createInitialData, triggerErrors } from './utils/createCollection.js';

async function main() {
  try {
    await ConnectionDB();
    console.log('Conectado ao banco!');

    //Funções para testar a criação
   await createInitialData();
    //Funções para disparar erros
   await triggerErrors();   

  } catch (error) {
    logError(error);
    console.error('Erro:', error.message);
  } finally {
    await closeConnection();
    console.log('Conexão fechada!');
  }
}

main();
