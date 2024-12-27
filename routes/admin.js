const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../models/ListaSolicitacaoUsuario')
const ListaSolicitacaoUsuario = mongoose.model('listaSolicitacaoUsuario')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')
require('../models/Produto')
const Produto = mongoose.model('produtos')
const {admin} = require("../helpers/verificarlogin")
const {paginacao} = require("../helpers/paginacao")
const solicitacao = require("./admin/solicitacao")
const usuarios = require('./admin/usuario')
const setor = require('./admin/setor')
const produto = require('./admin/produto')



router.get('/', admin, async (req, res) => {
    try{
        const totalSolicitacao = await ListaSolicitacaoUsuario.where('statusSolicitacao', 0).countDocuments()
        const totalContaSolicitada = await Usuario.find({aprovado: 0, solicitacao: 0}).countDocuments()
    
        res.render('admin/index', {totalSolicitacao, totalContaSolicitada})
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar os dados. Tente novamente mais tarde")
        res.redirect('/admin')
    }

})

router.use('/solicitacao', admin, solicitacao)

router.use('/usuarios', admin, usuarios)

router.use('/setor', admin, setor)

router.use('/produto', admin, produto)

router.get("/relatorio", admin, async (req, res) => {
    try{
        const produtos = await Produto.find()
        res.render("admin/relatorio/index", produtos)
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar os dados. Tente novamente mais tarde")
        res.redirect('/admin')
    }
})


module.exports = router