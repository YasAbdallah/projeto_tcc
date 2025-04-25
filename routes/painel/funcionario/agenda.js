const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
require('../../../models/Agendamento')
const Agendamento = mongoose.model('agendamento')
const { admin } = require("../../../helpers/verificarlogin")
const { validarCampo } = require('../../../helpers/funcoes')


router.get('/', admin, (req, res) => {
    Promise.all([
        Barbeiro.findOne({_id: res.locals.user._id}).select('-senha'),
        Agendamento.find({barbeiro: res.locals.user._id, status: "Agendado"}).populate("cliente")
    ])
    .then(([barbeiro, agendamento]) => {
        res.render('painel/funcionario/agendar', {barbeiro: barbeiro, agendamento: agendamento})
    })
    .catch((err) => { 
        req.flash('error_msg', 'Houve um erro ao listar o barbeiro ou a agenda')
        res.redirect('/painel/funcionario/index')
    })
})


module.exports = router

