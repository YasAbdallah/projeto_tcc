const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')


router.use((req, res, next) => {
    res.locals.layout = 'painel'
    next()
})

router.get('/', (req, res) => {
    res.render("painel/funcionario")
})

router.get('/agenda', (req, res) => {
    const barbeiros = Barbeiro.find().then((barbeiros) => {
        res.render('painel/funcionario/agendar', {barbeiros: barbeiros})
    }).catch((err) => { 
        req.flash('error_msg', 'Houve um erro ao listar os barbeiros')
        res.redirect('/painel/funcionario')
    })
})

router.get('/historico', (req, res) => {
    res.render('painel/funcionario/historico')
})

router.get('/perfil', (req, res) => {
    res.render('painel/funcionario/perfil')
})

module.exports = router
