import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome é obrigatório'] },
  email: { type: String, required: [true, 'O e-mail é obrigatório'], unique: [true, 'Já existe esse e-mail cadastrado'] },
  endereco: {
    type: new mongoose.Schema({
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      cidade: { type: String, required: true },
      estado: { type: String, required: true },
      cep: { type: String, required: true }
    }),
    required: [true, 'O endereço é obrigatório']
  },
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;
