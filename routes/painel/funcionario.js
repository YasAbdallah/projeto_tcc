const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
require('../../models/Agendamento')
const Agendamento = mongoose.model('agendamento')
const {admin} = require("../../helpers/verificarlogin")
const Perfil = require('./funcionario/perfil')
const Historico = require('./funcionario/historico')
const Agenda = require('./funcionario/agenda')


router.use((req, res, next) => {
    res.locals.layout = 'painel'
    next()
})

router.use('/agenda', admin, Agenda)
router.use('/historico', admin, Historico)


router.get('/', admin, (req, res) => {
    Promise.all([
        Barbeiro.findOne({_id: req.user._id}).select('-senha'),
        Agendamento.find({barbeiro: req.user._id, status: "Agendado"}).populate('cliente')
    ])
    .then(([barbeiro, agendamento]) => {
        res.render('painel/funcionario/index', {barbeiro: barbeiro, agendamento: agendamento})
    })
    .catch((err) => {
        res.redirect('/login')
    })
})



router.use('/perfil', admin, Perfil)

module.exports = router
