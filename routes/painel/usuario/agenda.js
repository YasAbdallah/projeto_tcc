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
    try {
        const barbeiros = await Barbeiro.find()
        const agendamento = await Agendamento.find({ cliente: req.user.id }).where('status').equals("Agendado").populate('barbeiro')
        console.log(agendamento)
        res.render('painel/usuario/agendar', {barbeiros: barbeiros, agendamento: agendamento})
    } catch (err) {
        req.flash('error_msg', 'Houve um erro ao listar os barbeiros')
        res.redirect('/painel/usuario/index')
    }
})


router.post('/agendarHorario', logado, (req, res) => {
    const {barbeiro, servico, data, horario} = req.body
    const validacao = [
        { campo: barbeiro, mensagem: "O campo Barbeiro é inválido." },
        { campo: servico, mensagem: "O campo Serviço é inválido." },
        { campo: data, mensagem: "O campo Data é inválido." },
        { campo: horario, mensagem: "O campo Horário é inválido." },
    ]

    validacao.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro) {
            res.json({ sucesso: false, message: erro })
            return
        }
    })
    const novosDados = {
        cliente: req.user.id,
        barbeiro, 
        servico, 
        dataAgendamento: data, 
        horaAgendamento: horario
    }
    
    new Agendamento(novosDados).save().then((cliente) => {
        res.json({ sucesso: true, message: "Dados alterados com sucesso." })
    }).catch((err) => {
        console.log(err)
        res.json({ sucesso: false, message: `Houve um erro ao tentar alterar os dados.` })
        return
    })
})

module.exports = router