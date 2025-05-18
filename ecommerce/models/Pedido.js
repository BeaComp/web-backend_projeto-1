const PedidoSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    produtos: [
        {
            produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
            quantidade: Number
        }
    ],
    dataPedido: { type: Date, default: Date.now },
    status: { type: String, enum: ['pendente', 'aprovado', 'enviado', 'entregue'], default: 'pendente' }
});