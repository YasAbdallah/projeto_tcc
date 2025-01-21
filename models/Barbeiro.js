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
    servicos: {
        type: [String],
        required: true
    },
    diasDisponiveis: {
        type: [String],
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
    dataCriacaoRegistro: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("barbeiro", Barbeiro);
