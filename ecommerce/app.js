// index.js
import { conectarDB } from './database/connection.js';

async function main() {
  try {
    const db = await conectarDB();
    console.log(`✅ Conectado ao banco: ${db.databaseName}`);
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
  }
}

main();
