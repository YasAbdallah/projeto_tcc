const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
require('../../models/Agendamento')
const Agendamento = mongoose.model('agendamento')
const {logado} = require("../../helpers/verificarlogin")
const Perfil = require('./usuario/perfil')
const Agenda = require('./usuario/agenda')
const Historico = require('./usuario/historico')



router.use((req, res, next) => {
    res.locals.layout = 'painel'
    next()
})

router.use('/perfil', logado, Perfil)

router.use('/agenda', logado, Agenda)

router.use('/historico', logado, Historico)

router.get('/', logado, async (req, res) => {
    const agendamento = await Agendamento.find().where('cliente').equals(req.user._id).populate('barbeiro')
    res.render('painel/usuario', {agendamento})
})


module.exports = router
