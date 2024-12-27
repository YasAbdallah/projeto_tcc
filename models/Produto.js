const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const Produto  = new Schema({
    codigo: {
        type: String,
        required: true
    },
    produto: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    observacao: {
        type: String,
        required: true
    },
    saldo: {
        type: Number,
        required: true
    }
})

mongoose.model("produtos", Produto)