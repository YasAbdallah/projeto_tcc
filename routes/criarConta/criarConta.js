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
    const {nome, email, telefone, senha, confirmarSenha} = req.body

    const validacao = [
        {campo: nome, mensagem: "O campo NOME é inválido."},
        {campo: email, mensagem: "O campo SOBRENOME é inválido."},
        {campo: telefone, mensagem: "O campo TELEFONE é inválido."},
        {campo: senha, mensagem: "SENHA inválida."},
        {campo: confirmarSenha, mensagem: "SENHA inválida."}
    ]

    validacao.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro) {
            res.json({sucesso: false, message: erro})
            return
        }
    })

    if (senha !== confirmarSenha) {
        res.json({sucesso: false, message: "As senhas não coincidem."})
        return
    }
    
    try{

        const salt = await bcrypt.genSalt(10) // Gera um salt criptográfico com fator de custo 10, que será usado para "salgar" a senha antes de criar o hash
        const hash = await bcrypt.hash(senha, salt)
        const novoUsuario = { nome: nome, email: email, telefone: telefone, senha: hash}
        await new Cliente(novoUsuario).save()
        res.json({sucesso: true, message: "Conta criada com sucesso."})
        return
    }catch(error){
        console.log(error)
        res.json({sucesso: false, message: "Ocorreu um erro interno ao tentar criar a conta. Tente novamente mais tarde."})
        return
    }
})

//TODO: corrigir criação de conta
module.exports = router
