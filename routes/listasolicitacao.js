const express = require('express')
const mongoose = require("mongoose")
require('../models/Solicitacao')
const Solicitacao = mongoose.model('solicitacao')
require('../models/Produto')
const router = express.Router()
const {logado} = require("../helpers/verificarlogin")
const {paginacao} = require("../helpers/paginacao")

router.get('/', logado, async (req, res) => {
    try{
        const pagina = req.query.pag || 1
        const itensPorPagina = req.query.itensPorPagina || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite

        //Buscar os produtos paginados
        const solicitacao = await Solicitacao.find().skip(indiceItemPagina).populate(["produto", "usuario"]).sort({'data': "DESC"}).limit(limite)
        
        //capturando total de itens no BD
        const totalItens = await Solicitacao.countDocuments()
        //Calculando Paginação
        const paginas = await paginacao('/listasolicitacao', pagina, limite, totalItens)
        res.render('listasolicitacao/index', {solicitacao, paginas})

    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

module.exports = router