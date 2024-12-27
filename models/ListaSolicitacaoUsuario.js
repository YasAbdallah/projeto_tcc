const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const ListaSolicitacaoUsuario = new Schema({
    itens: [{
        produto: {
            //PK
            type: Schema.Types.ObjectId,
            ref: "produtos",
            required: true
        },
        quantidade: {
            type: Number,
            required: true
        },
        statusSolicitacaoProduto: {
            type: Number,
            required: true,
            default: 0 // 0 == em espera | 1 == autorizado | 2 == negado
        }
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    statusSolicitacao: {
        type: Number,
        required: true,
        default: 0 // 0 == Em Status em espera de autorização | 1 == Em Status de aguardando retirada | 2 == Em status de solicitação negada.
    },
    statusRetirada:{
        type: Boolean,
        require: false,
        default: false
    },
    dataRetirada: {
        type: Date,
        require: false
    },
    data: {
        type: Date,
        require: true,
        default: Date.now()
    },
    identificador: {
        type: String,
        require: true,
    }
})

mongoose.model("listaSolicitacaoUsuario", ListaSolicitacaoUsuario)