const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')
const bcrypt = require('bcryptjs')
const {validarCampoSenha} = require("../../helpers/funcoes")

router.get("/", async (req, res) => {
    res.render('login/trocarSenha')
})

router.post('/trocarSenha', async (req, res) => {
    const {cpf, novaSenha, novaSenha2} = req.body
    const validacao = [
        {campo: cpf, mensagem: "O CPF inserido é inválido."},
        {campo: novaSenha, mensagem: "A senha inserida é inválida."},
    ]

    validacao.forEach((campo, mensagem) => {
        const erro = validarCampoSenha(campo, mensagem)
        if(erro){
            res.json({sucesso: false, message: erro})
            return
        }
    })
    if(novaSenha != novaSenha2){
        res.json({sucesso: false, message: "As senhas não coincide. Verifique e tente novamente."})
        return
    }
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(novaSenha, salt)
        const usuario = await Usuario.findOneAndUpdate({cpf: cpf}, {senha: hash, senhaPadraoAlterada: true})
        res.json({sucesso: true, message: "Senha alterada com sucesso!"})
        return
    }catch(error){
        res.json({sucesso: false, message: "Ocorreu um erro inesperado ao tentar trocar a senha."})
        return
    }
})

module.exports = router
