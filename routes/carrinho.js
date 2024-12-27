const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../models/Carrinho')
const Carrinho = mongoose.model('carrinho')
const {logado} = require("../helpers/verificarlogin")

router.post("/add", logado, async (req, res) => {
    try{
        const {id, saldo} = req.body
        const adicionarCarrinho = {
            quantidade: saldo,
            produto: id,
            usuario: req.user.id
        }
        res.send("Dados recebidos com sucesso")
    }catch(error){
        req.flash("error_msg", "Erro ao carregar os dados do carrinho. Código: cart-01")
        res.redirect('/')
    }
})

module.exports = router