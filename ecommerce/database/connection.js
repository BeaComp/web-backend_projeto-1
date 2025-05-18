import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'ecommerce';

export async function ConnectionDB() {
  const cliente = new MongoClient(uri);
  await cliente.connect();
  console.log('MongoDB conectado!');
  return cliente.db(dbName);
}

export async function closeConnection() {
  if (cliente) {
    await cliente.close();
    console.log('Conexão MongoDB fechada!');
    cliente = null;
  }
}