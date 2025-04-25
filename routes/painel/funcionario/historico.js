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

router.get('/', admin, async (req, res) => {
    try{
        const agendamento = await Agendamento.find().where('barbeiro').equals(req.user._id).populate('cliente')
        console.log(agendamento)
        res.render('painel/funcionario/historico', {agendamento})
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Houve um erro ao listar os agendamentos')
        res.redirect('/painel/funcionario/index')
    }
    
})

module.exports = router