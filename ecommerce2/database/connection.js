import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

export async function ConnectionDB() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB (Mongoose) conectado!');
  } catch (error) {
    console.error('Erro ao conectar com Mongoose:', error.message);
    // Para desenvolvimento, vamos continuar mesmo sem MongoDB
    console.log('Continuando sem banco de dados para demonstração...');
  }
}

export async function closeConnection() {
  try {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB (Mongoose) fechada!');
  } catch (error) {
    console.error('Erro ao fechar a conexão:', error.message);
  }
}

