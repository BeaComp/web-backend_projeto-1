import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome é obrigatório'] },
  email: { 
    type: String, 
    required: [true, 'O e-mail é obrigatório'], 
    unique: [true, 'Já existe esse e-mail cadastrado'],
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
  },
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
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  }
});

ClienteSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

ClienteSchema.methods.verificarSenha = async function(senhaInformada) {
  try {
    return await bcrypt.compare(senhaInformada, this.senha);
  } catch (error) {
    throw new Error('Erro ao verificar senha');
  }
};

ClienteSchema.methods.toJSON = function() {
  const cliente = this.toObject();
  delete cliente.senha;
  return cliente;
};

ClienteSchema.statics.buscarPorEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), ativo: true });
};

ClienteSchema.statics.buscarPorEmailComSenha = function(email) {
  return this.findOne({ email: email.toLowerCase(), ativo: true }).select('+senha');
};

const Cliente = mongoose.model('Cliente', ClienteSchema);
export default Cliente;

