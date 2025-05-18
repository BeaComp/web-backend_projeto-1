import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome é obrigatório'] },
  email: { type: String, required: [true, 'O e-mail é obrigatório'], unique: [true, 'Já existe esse e-mail cadastrado'] },
  endereco: {
    type: new mongoose.Schema({
      rua: { type: String, required: [true, 'A rua é obrigatória'] },
      numero: { type: String, required: [true, 'O número é obrigatório'] },
      cidade: { type: String, required: [true, 'A cidade é obrigatória'] },
      estado: { type: String, required: [true, 'O estado é obrigatório'] },
      cep: { type: String, required: [true, 'O CEP é obrigatório'] }
    }),
    required: [true, 'O endereço é obrigatório']
  },
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;
