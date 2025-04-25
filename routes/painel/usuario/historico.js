const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
require('../../../models/Agendamento')
const Agendamento = mongoose.model('agendamento')
const { logado } = require("../../../helpers/verificarlogin")
const { validarCampo } = require('../../../helpers/funcoes')

router.get('/', logado, async (req, res) => {
    const agendamento = await Agendamento.find().where('cliente').equals(req.user._id).populate('barbeiro')
    console.log(agendamento)
    res.render('painel/usuario/historico', {agendamento})
})

module.exports = router