const mongoose = require('../database/connection');

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: String,
    estoque: Number,
    ativo: Boolean
});

module.exports = mongoose.model('Produto', ProdutoSchema);