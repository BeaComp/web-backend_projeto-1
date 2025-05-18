// index.js
import dotenv from 'dotenv';
import { conectarDB } from './database/connection.js';

dotenv.config();

async function main() {
  try {
    const db = await conectarDB();
    console.log(`✅ Conectado ao banco: ${db.databaseName}`);
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
  }
}

main();
