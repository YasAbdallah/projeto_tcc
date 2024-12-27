const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const Setor = new Schema({
    nomeSetor: {
        type: String,
        required: true
    },
    sigla: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
})

mongoose.model("setor", Setor)