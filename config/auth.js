const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
require("../models/Usuario")
const Usuario = mongoose.model('usuario')

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: "cpf", passwordField: "senha"}, (cpf, senha, done) => {
        Usuario.findOne({cpf: cpf}).then((usuario) => {
            if(!usuario){ return done(null, false, {message: "Usuário ou senha incorretos."}) }
            bcrypt.compare(senha, usuario.senha, (err, iguais) => {
                if(iguais){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Usuário ou senha incorretas."})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario) => {
            done(null, {
                id: usuario.id,
                nome: usuario.nome,
                sobrenome: usuario.sobrenome,
                tipoUsuario: usuario.tipoUsuario,
                secao: usuario.secao,
            })
        })
    })


}