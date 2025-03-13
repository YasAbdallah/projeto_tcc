const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
const Barbeiro = mongoose.model('barbeiro')
const bcrypt = require('bcryptjs')
const { validarCampo, enviarEmailTrocarSenha, gerarToken, validarCampoSenha, mascaraCPF, removeMascaraCPF } = require("../../helpers/funcoes")
const { json } = require('body-parser')
require('dotenv').config()

router.get("/", async (req, res) => {
    res.render('login/trocarSenha')
})

router.post('/trocarSenha', async (req, res) => {
    try {
        const {novaSenha, novaSenha2} = req.body
        cpf = await mascaraCPF(req.body.cpf)
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
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(novaSenha, salt)

        // Procurar o usuário na coleção de Clientes
        try {
            // Tentar encontrar o usuário na coleção de Clientes
            let usuario = await Cliente.findOne({ cpf: cpf })
            
            if (usuario) {
                await Cliente.updateOne({ cpf: cpf }, { senha: hash })
                return res.json({ sucesso: true, message: "Senha alterada com sucesso!" })
            }
    
            // Se não encontrar na coleção de Clientes, tentar na coleção de Barbeiros
            usuario = await Barbeiro.findOne({ cpf: cpf })
            console.log(usuario)
           if (usuario) {
                await Barbeiro.updateOne({ cpf: cpf }, { senha: hash })
                return res.json({ sucesso: true, message: "Senha alterada com sucesso!" })
            }
            // Se não encontrar em nenhuma das coleções
            return res.json({ sucesso: false, message: "Usuário não encontrado." })
        } catch (error) {
            console.log(error)
            return res.json({ sucesso: false, message: "Ocorreu um erro inesperado ao tentar trocar a senha." })
        }
    }catch(error){
        console.log(error)
        return res.json({sucesso: false, message: "Ocorreu um erro inesperado ao tentar validar dados."})
    }
})


module.exports = router