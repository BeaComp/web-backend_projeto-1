import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [3, 'O nome deve ter no mínimo 3 caracteres'],
    unique: [true, 'Já existe um produto cadastrado com esse nome']
  },
  descricao: {
    type: String,
    maxlength: [200, 'A descrição pode ter no máximo 200 caracteres']
  },
  estoque: {
    type: Number,
    default: 0,
    min: [0, 'O estoque não pode ser negativo']
  },
  ativo: {
    type: Boolean,
    default: true
  }
});

const Produto = mongoose.model('Produto', ProdutoSchema);
export default Produto;
