import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  endereco: {
    type: new mongoose.Schema({
      rua: { type: String, required: true },
      numero: { type: String, required: true },
      cidade: { type: String, required: true },
      estado: { type: String, required: true },
      cep: { type: String, required: true }
    }),
    required: true
  },
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;
