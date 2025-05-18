// models/produto.js
import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  estoque: Number,
  ativo: Boolean,
});

export default mongoose.model('Produto', ProdutoSchema);
