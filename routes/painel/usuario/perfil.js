const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Cliente')
const Cliente = mongoose.model('cliente')
const { logado } = require("../../../helpers/verificarlogin")
const { validarCampo } = require('../../../helpers/funcoes')


router.get('/', logado, async (req, res) => {
    try {
        res.render('painel/usuario/perfil')
    } catch (error) {
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/painel/usuario/index")
    }
})

router.post('/alterarDados', logado, (req, res) => {
    const { nome, sobrenme, dataNascimento, cpf, genero, outroGenero, email, telefone, cep, estado, cidade, bairro, rua, numeroCasa } = req.body
    const validacao = [
        { campo: nome, mensagem: "O campo NOME é inválido." },
        { campo: sobrenme, mensagem: "O campo SOBRENOME é inválido." },
        { campo: dataNascimento, mensagem: "O campo Data de Nacimento é inválido." },
        { campo: cpf, mensagem: "O campo CPF é inválida." },
        { campo: genero, mensagem: "O campo GENERO é inválida." },
        { campo: outroGenero, mensagem: "O campo GENERO é inválida." },
        { campo: email, mensagem: "O campo EMAIL é inválida." },
        { campo: telefone, mensagem: "O campo TELEFONE é inválida." },
        { campo: cep, mensagem: "O campo CEP é inválida." },
        { campo: estado, mensagem: "O campo ESTADO é inválida." },
        { campo: cidade, mensagem: "O campo CIDADE é inválida." },
        { campo: bairro, mensagem: "O campo BAIRRO é inválida." },
        { campo: rua, mensagem: "O campo RUA é inválida." },
        { campo: numeroCasa, mensagem: "O campo NÚMERO é inválida." }
    ]

    if (genero == "outro") {
        req.body.genero = outroGenero
    }
    
    
    validacao.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro) {
            res.json({ sucesso: false, message: erro })
            return
        }
    })
    const novosDados = { 
        nome, 
        sobrenme, 
        dataNascimento, 
        cpf, 
        genero: req.body.genero, 
        email, 
        telefone, 
        endereco: {
            cep, 
            estado, 
            cidade, 
            bairro, 
            rua, 
            numero: numeroCasa
        }
    }
    
    Cliente.findOneAndUpdate(req.user._id, novosDados).then((cliente) => {
        res.json({ sucesso: true, message: "Dados alterados com sucesso." })
    }).catch((err) => {
        console.log(err)
        res.json({ sucesso: false, message: `Houve um erro ao tentar alterar os dados.` })
        return
    })
})

module.exports = router