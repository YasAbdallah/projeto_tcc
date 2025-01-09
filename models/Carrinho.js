const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Carrinho = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "cliente",
        required: true
    },
    itens: [
        {
            produto: {
                type: Schema.Types.ObjectId,
                ref: "produto",
                required: true
            },
            quantidade: {
                type: Number,
                required: true,
                default: 1
            },
            preco: {
                type: Number,
                required: true
            }
        }
    ],
    precoTotal: {
        type: Number,
        required: true,
        default: 0
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    ativo: {
        type: Boolean,
        default: true
    }
});

mongoose.model("carrinho", Carrinho);
