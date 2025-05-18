// index.js
import { ConnectionDB } from './database/connection.js';
import { closeConnection } from './database/connection.js';

async function main() {
  try {
    const db = await ConnectionDB();
    console.log(`Conectado ao banco: ${db.databaseName}`);

    console.log(`Fechando conexão com o banco: ${db.databaseName}`)
    await fecharConexao();
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
  }
}

main();
