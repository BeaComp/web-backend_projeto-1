import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = 'mongodb://localhost:27017';
const dbName = 'ecommerce';

export async function conectarDB() {
  const cliente = new MongoClient(uri);
  await cliente.connect();
  console.log('MongoDB conectado!');
  return cliente.db(dbName);
}
