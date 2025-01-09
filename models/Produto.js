const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    preco: {
        type: Number,
        required: true
    },
    estoque: {
        type: Number,
        required: true,
        default: 0
    },
    categoria: {
        type: String,
        required: false
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

mongoose.model("produto", Produto);
