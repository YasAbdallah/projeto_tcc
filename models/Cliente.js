const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cliente = new Schema({
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

    tipo: {
        type: Number,
        default: 1 // Barbeiro
    },
    dataCriacaoRegistro: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("cliente", Cliente);
