import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/ecommerce';

export async function ConnectionDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB (Mongoose) conectado!');
  } catch (error) {
    console.error('Erro ao conectar com Mongoose:', error.message);
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
