const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Barbeiro = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: true
    },
    endereco: {
        type: [
            {
                cep: Number,
                estado: String,
                cidade: String,
                bairro: String,
                rua: String,
                numero: Number
            }
        ],
        required: true
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
