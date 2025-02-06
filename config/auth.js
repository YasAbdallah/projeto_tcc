const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

require("../models/Cliente");
const Cliente = mongoose.model('cliente');

require("../models/Barbeiro");
const Barbeiro = mongoose.model('barbeiro');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "senha" }, (email, senha, done) => {
        // Verifica no modelo Cliente
        Cliente.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                // Se não encontrar no modelo Cliente, busca no modelo Barbeiro
                return Barbeiro.findOne({ email: email }).then((barbeiro) => {
                    if (!barbeiro) {
                        return done(null, false, { message: "Usuário ou senha incorretos." });
                    }
                    // Comparação de senha para Barbeiro
                    bcrypt.compare(senha, barbeiro.senha, (err, iguais) => {
                        if (iguais) {
                            return done(null, barbeiro);
                        } else {
                            return done(null, false, { message: "Usuário ou senha incorretos." });
                        }
                    });
                });
            }
            // Comparação de senha para Cliente
            bcrypt.compare(senha, usuario.senha, (err, iguais) => {
                if (iguais) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: "Usuário ou senha incorretos." });
                }
            });
            
        }).catch((err) => done(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, { id: user._id, tipo: user.tipoUsuario }); // Armazena o ID do usuário e o tipo de usuário na sessão
    });

    passport.deserializeUser((user, done) => {
        if (user.tipo === 'cliente') {
            // Busca no modelo Cliente
            Cliente.findById(user.id).then((usuario) => {
                if (usuario) {
                    done(null, {
                        id: usuario.id,
                        nome: usuario.nome,
                        secao: usuario.secao,
                    });
                } else {
                    done(null, false);
                }
            }).catch((err) => done(err));
        } else if (user.tipo === 'barbeiro') {
            // Busca no modelo Barbeiro
            Barbeiro.findById(user.id).then((barbeiro) => {
                if (barbeiro) {
                    done(null, {
                        id: barbeiro.id,
                        nome: barbeiro.nome,
                    });
                } else {
                    done(null, false);
                }
            }).catch((err) => done(err));
        } else {
            done(null, false);
        }
    });
};
