const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const Carrinho = new Schema({
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
    }],
    usuario: {
        //PK
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true
    }
})

mongoose.model("carrinho", Carrinho)