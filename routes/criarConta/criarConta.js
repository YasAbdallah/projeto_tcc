const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
const bcrypt = require('bcryptjs')
const {validarCampo} = require("../../helpers/funcoes")

router.get("/", async (req, res) => {
    res.render('criarConta/')
})

router.post("/criarConta", async (req, res) => {
    const {nome, email, telefone, senha} = req.body

    const validacao = [
        {campo: nome, mensagem: "O campo NOME é inválido."},
        {campo: email, mensagem: "O campo SOBRENOME é inválido."},
        {campo: telefone, mensagem: "O campo TELEFONE é inválido."},
        {campo: senha, mensagem: "SENHA inválida."}
    ]

    validacao.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro) {
            res.json({sucesso: false, message: erro})
            return
        }
    })
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(novaSenha, salt)
        const novoUsuario = { nome: nome, email: email, telefone: telefone, senha: hash}
        await new Cliente(novoUsuario).save()
        res.json({sucesso: true, message: "Conta criada com sucesso."})
        return
    }catch(error){
        res.json({sucesso: false, message: "Ocorreu um erro interno ao tentar criar a conta. Tente novamente mais tarde."})
        return
    }
})

//TODO: corrigir criação de conta
module.exports = router
