const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')
const {validarCampo} = require("../../helpers/funcoes")
require('../../models/Setor')
const Setor = mongoose.model('setor')

router.get("/", (req, res) => {
    res.render("conta/solicitar")
})

router.post("/solicitar",  async (req, res) => {
    const {nome, sobrenome, cpf, setor} = req.body

    const validacao = [
        {campo: nome, mensagem: "O campo NOME é inválido."},
        {campo: sobrenome, mensagem: "O campo SOBRENOME é inválido."},
        {campo: cpf, mensagem: "O campo CPF é inválido."},
        {campo: setor, mensagem: "Setor inválido."},
    ]

    validacao.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro) {
            res.json({sucesso: false, message: erro})
            return
        }
    })
    
    try{
        const idSetor = await Setor.findOne({sigla: setor})

        const novoUsuario = { nome: nome, sobrenome: sobrenome, cpf: cpf, aprovado: 0, visibilidade: 1, solicitacao: 0, secao: idSetor._id}
        await new Usuario(novoUsuario).save()
        res.json({sucesso: true, message: "Conta solicitada. Aguarde mais detalhes do administrador."})
        return
    }catch(error){
        res.json({sucesso: false, message: "Ocorreu um erro interno ao solicitar a conta. Tente novamente mais tarde."})
        return
    }
})

module.exports = router
