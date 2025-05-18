import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  estoque: { type: Number, default: 0 },
  ativo: { type: Boolean, default: true }
});

const Produto = mongoose.model('Produto', ProdutoSchema);
export default Produto;
