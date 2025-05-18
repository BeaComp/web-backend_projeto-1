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

module.exports = mongoose.model('Cliente', ClienteSchema);