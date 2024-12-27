const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const Usuario = new Schema({
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
    senha: {
        type: String,
        required: true,
        default: 'Trocar@$1234'
    },
    senhaAlterada: {
        type: Boolean,
        default: false // false - não alterada | true - alterada
    },
    secao: {
        type: Schema.Types.ObjectId,
        ref: "setor"
    },
    tipoUsuario: {
        type: Number,
        default: 0 // 0 - Não adm | 1 - adm
    },
    aprovado: {
        type: Number,
        default: 0 // 0 - Não aprovado | 1 - aprovado
    },
    visibilidade: {
        type: Number,
        default: 0 // 0 - não visivel na aba de lista de usuarios | 1 - visivel na aba de lista de usuarios
    },
    solicitacao: {
        type: Number,
        default: 0 // 0 - Conta solicitada pelo usuário | 1 - Conta criada pelo adm | 2 - conta aceita pelo adm.
    }
})

mongoose.model("usuario", Usuario)