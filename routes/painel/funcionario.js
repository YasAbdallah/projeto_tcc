const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
require('../../models/Agendamento')
const Agendamento = mongoose.model('agendamento')
const {admin} = require("../../helpers/verificarlogin")


router.use((req, res, next) => {
    res.locals.layout = 'painel'
    next()
})

router.get('/', admin, (req, res) => {
    Promise.all([
        Barbeiro.findOne({_id: res.locals.user._id}).select('-senha'),
        Agendamento.find({barbeiro: res.locals.user._id, status: "Agendado"})
    ])
    .then(([barbeiro, agenda]) => {
        res.render('painel/funcionario/index', {barbeiro: barbeiro, agenda: agenda})
    })
    .catch((err) => {
        res.redirect('/login')
    })
})

router.get('/agenda', admin, (req, res) => {
    Promise.all([
        Barbeiro.findOne({_id: res.locals.user._id}).select('-senha'),
        Agendamento.find({barbeiro: res.locals.user._id, status: "Agendado"})
    ])
    .then(([barbeiro, agenda]) => {
        res.render('painel/funcionario/agendar', {barbeiro: barbeiro, agenda: agenda})
    })
    .catch((err) => { 
        req.flash('error_msg', 'Houve um erro ao listar o barbeiro ou a agenda')
        res.redirect('/painel/funcionario/index')
    })
})

router.get('/historico', admin, (req, res) => {
    res.render('painel/funcionario/historico')
})

router.get('/perfil', admin, (req, res) => {
    res.render('painel/funcionario/perfil')
})

module.exports = router
