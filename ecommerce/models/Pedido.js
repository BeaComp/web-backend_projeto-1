import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  produtos: [
    {
      produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
      },
      quantidade: {
        type: Number,
        required: true,
        min: 1
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
