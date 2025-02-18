const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Barbeiro = new Schema({
    nome: {
        type: String,
        required: true
    },
    contato: {
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
    dataNascimento: {
        type: Date,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    servicos: {
        type: [String],
        required: true
    },
    diasDisponiveis: {
        type: [Number],
        required: true
    },
    horariosDisponiveis: {
        type: [
            {
                start: String,
                end: String
            }
        ],
        required: true
    },
    tipo: {
        type: Number,
        default: 0 // Barbeiro
    },
    dataCriacaoRegistro: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("barbeiro", Barbeiro);
