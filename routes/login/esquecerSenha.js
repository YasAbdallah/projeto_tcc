const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const nodemailer = require('nodemailer')
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
const bcrypt = require('bcryptjs')
const { validarCampo, enviarEmailTrocarSenha, gerarToken } = require("../../helpers/funcoes")
require('dotenv').config()

router.get("/", async (req, res) => {
    res.render('login/esquecerSenha')
})

router.post('/esquecerSenha', async (req, res) => {
    const { email } = req.body
    const validacao = [
        { campo: email, mensagem: "EMAIL inválido." },
    ]

    const cliente = await Cliente.findOne({ email: email })
    if (cliente) {
        validacao.forEach((campo, mensagem) => {
            const erro = validarCampo(campo, mensagem)
            if (erro) return res.json({ sucesso: false, message: erro })
        })

        try {
            const token = await gerarToken(email)
            const resultado = await enviarEmailTrocarSenha(email, cliente.nome, "/login/trocarSenha", token)
            if (resultado.sucesso) {
                res.json({ sucesso: true, message: resultado.message })
                return
            } else {
                res.json({ sucesso: false, message: resultado.message })
                return
            }
        } catch (error) {
            res.json({ sucesso: false, message: "Ocorreu um erro ao trocar a senha. Tente novamente mais tarde." })
            return
        }
    } else {
        res.json({ sucesso: false, message: "ocorreu um erro interno na troca de senha. Tente novamente mais tarde." })
        return
    }
})


module.exports = router