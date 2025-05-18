import { ConnectionDB, closeConnection } from './database/connection.js';
import { logError } from './utils/logger.js';
import { createInitialData, triggerErrors, editarClientePorEmail } from './utils/createCollection.js';

async function main() {
  try {
    await ConnectionDB();
    console.log('Conectado ao banco!');
    await editarClientePorEmail({
        nome: 'João da Silva',
        endereco: {
          rua: 'Rua Nova',
          numero: '456',
          cidade: 'Campinas',
          estado: 'SP',
          cep: '13000-000'
    }})
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
