const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
const {logado} = require("../../helpers/verificarlogin")


router.use((req, res, next) => {
    res.locals.layout = 'painel'
    next()
})

router.get('/', logado, (req, res) => {
    res.render('painel/usuario')
})

router.get('/agenda', logado, (req, res) => {
    const barbeiros = Barbeiro.find().then((barbeiros) => {
        res.render('painel/usuario/agendar', {barbeiros: barbeiros})
    }).catch((err) => { 
        req.flash('error_msg', 'Houve um erro ao listar os barbeiros')
        res.redirect('/painel/usuario')
    })
})

router.get('/historico', logado, (req, res) => {
    res.render('painel/usuario/historico')
})

router.get('/perfil', logado, (req, res) => {
    res.render('painel/usuario/perfil')
})



module.exports = router
