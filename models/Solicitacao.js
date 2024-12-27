const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Solicitacao = new Schema({
    quantidade: {
        type: Number,
        required: true
    },
    produto: {
        type: String,
        required: true
    },
    codigo: {
        type: Number,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    setor: {
        type: Schema.Types.ObjectId,
        ref: 'setor',
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("solicitacao", Solicitacao)