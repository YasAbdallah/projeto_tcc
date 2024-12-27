const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')
const passport = require("passport")
const trocarSenha = require('./trocarSenha')

router.use("/trocarSenha", trocarSenha)

router.get('/', (req, res) => {
    res.render("login/")
})

router.post('/login', async (req, res, next) => {
    try{
        const usuario = await Usuario.findOne({cpf: req.body.cpf})
        if(!usuario.senhaPadraoAlterada && req.body.senha == 'Trocar@$1234'){
            res.json({trocarSenha:true})
            return
        }else{
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    res.json({sucesso: false, message: "Ocorreu um erro inesperado ao tentar logar."})
                    return
                }
                if (!user) {
                    
                    res.json({sucesso: false, message: info.message || "CPF ou senha incorretos. Tente Novamente"})
                    return
                }

                req.logIn(user, (err) => {
                    if(err) {
                        res.json({sucesso: false, message: "Ocorreu um erro ao tentar logar. Por favor tente novamente"})
                        return
                    }
                    res.json({sucesso: true, message: "Redirecinando."})
                    return 
                })
            })(req, res, next)
        }
    }catch(error){
        

        res.json({sucesso: true, message: "ocorreu um erro inesperado ao tentar logar."})
        return
    }
})

module.exports = router