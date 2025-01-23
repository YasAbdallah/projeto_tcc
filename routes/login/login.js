const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
const passport = require("passport")
const esquecerSenha = require('./esquecerSenha')

router.use("/esquecerSenha", esquecerSenha)

router.get('/', (req, res) => {
    res.render("login/")
})

router.post('/login', async (req, res, next) => {
    try {
        // Procurar o usuário na coleção de Clientes
        let usuario = await Cliente.findOne({ email: req.body.email }).select('nome email tipo');

        // Se não encontrar na coleção de Clientes, procurar na coleção de Barbeiros
        if (!usuario) {
            usuario = await Barbeiro.findOne({ email: req.body.email }).select('nome email tipo');
        }

        // Se nenhum usuário for encontrado em ambas as coleções
        if (!usuario) {
            return res.json({ sucesso: false, message: "Email ou senha incorretos." });
        }

        // Passar o controle para o Passport.js para autenticação
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log(err)
                return res.json({ sucesso: false, message: "Ocorreu um erro inesperado ao tentar logar." });
            }

            if (!user) {
                return res.json({ sucesso: false, message: info.message || "Email ou senha incorretos. Tente novamente." });
            }

            req.logIn(user, (err) => {
                if (err) {
                    return res.json({ sucesso: false, message: "Ocorreu um erro ao tentar logar. Por favor, tente novamente." });
                }

                return res.json({ sucesso: true, message: "Redirecionando.", user });
            });
        })(req, res, next);
    } catch (error) {
        console.error("Erro no login:", error);
        return res.json({ sucesso: false, message: "Ocorreu um erro inesperado ao tentar logar." });
    }
});


module.exports = router