import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'O cliente é obrigatório']
  },
  produtos: [
    {
      produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: [true, 'O produto é obrigatório']
      },
      quantidade: {
        type: Number,
        required: [true, 'A quantidade é obrigatório'],
        min: [1, 'A quantidade deve ser no mínimo 1']
      }
    }
  ],
  dataPedido: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'enviado', 'entregue'],
    default: 'pendente'
  }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);
export default Pedido;
