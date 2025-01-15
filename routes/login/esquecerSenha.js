const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
const bcrypt = require('bcryptjs')
const {validarCampo} = require("../../helpers/funcoes")

router.get("/", async (req, res) => {
    res.render('login/esquecerSenha')
})

router.post('/esquecerSenha', async (req, res) => {
    const {cpf, novaSenha, novaSenha2} = req.body
    const validacao = [
        {campo: cpf, mensagem: "CPF inválido."},
        {campo: novaSenha, mensagem: "Senha inválida. Verifique se a senha contém os padrões de segurança obrigatório."},
        {campo: novaSenha2, mensagem: "Senha inválida. Verifique se a senha contém os padrões de segurança obrigatório."},
    ]

    const cliente = await Cliente.findOne({cpf: cpf})
    if (cliente){
        validacao.forEach((campo, mensagem) => {
            const erro = validarCampo(campo, mensagem)
            if (erro) return res.json({sucesso: false, message: erro})
        })
        if(novaSenha != novaSenha2){
            return res.json({sucesso: false, message: "As senhas não batam."})
        }
        try{
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(novaSenha, salt)
            await Cliente.updateOne({id: req.body.id}, {senha: hash})
            res.json({sucesso: true, message: "Senha alterada com sucesso."})
            return
        }catch(error){
            res.json({sucesso: false, message: "Ocorreu um erro ao trocar a senha. Tente novamente mais tarde."})
            return
        }
    }else{
        res.json({sucesso: false, message: "ocorreu um erro interno na troca de senha. Tente novamente mais tarde."})
        return
    }
})

module.exports = router