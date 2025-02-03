const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const nodemailer = require('nodemailer')
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
const bcrypt = require('bcryptjs')
const { validarCampo } = require("../../helpers/funcoes")
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

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                }
            })

            const mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: "Recuperação de senha. Projeto-TCC Barbearia",
                html: `
                    <h1>Olá, ${cliente.nome}!</h1>
                    <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefini-la:</p>
                    <p><a href="https://localhost:3000/login/trocarSenha?token=${token}">Redefinir senha</a></p>
                    <p>Se você não solicitou esta mudança, ignore este e-mail.</p>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.json({ sucesso: false, message: "Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde." })
                    return
                }
                res.json({ sucesso: true, message: "E-mail enviado com sucesso. Verifique sua caixa de entrada ou span." })
                return
            })
        }catch (error) {
                res.json({ sucesso: false, message: "Ocorreu um erro ao trocar a senha. Tente novamente mais tarde." })
                return
            }
        }else {
            res.json({ sucesso: false, message: "ocorreu um erro interno na troca de senha. Tente novamente mais tarde." })
            return
        }
    })

module.exports = router