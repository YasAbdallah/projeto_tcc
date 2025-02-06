const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cliente = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: false
    },
    endereco: {
        type: String,
        required: false
    },
    senha: {
        type: String,
        required: true
    },
    dataNacimento: {
        type: Date,
        required: false
    },
    genero:{
        type: String,
        required: false
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: Number,
        default: 1 // Cliente
    },
    ativo: {
        type: Boolean,
        default: true
    }
});

mongoose.model("cliente", Cliente);
