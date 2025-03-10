const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
const {admin} = require("../../../helpers/verificarlogin")
const {validarCampo, inicializarArray, adicionarValorArray} = require("../../../helpers/funcoes")

router.get('/', admin, (req, res) => {
    res.render('painel/funcionario/perfil')
})

router.post("/alterarDados", admin, (req, res) => {
    const novosDados = {}
    Object.keys(req.body).forEach((key) => {
        const error = validarCampo(key, `O campo ${key} é inválido.`)
        if (error) {
            return res.json({ sucesso: false, message: error })
        }
        if(key.includes("dia-")){
            inicializarArray(novosDados, "diasDisponiveis")
            adicionarValorArray(novosDados, "diasDisponiveis", req.body[key])
            return
        }

        if(key.includes("entradaAntes")){
            inicializarArray(novosDados, "horariosDisponiveis")
            if(req.body[key] !== ''){
                novosDados.horariosDisponiveis.push({start: req.body[key]})
            }
            return
        }
        if(key.includes("saidaAntes")){
            inicializarArray(novosDados, "horariosDisponiveis")
            if(req.body[key] !== ''){
                novosDados.horariosDisponiveis[0].end = req.body[key]
            }
            return
        }

        if(key.includes("entradaDepois")){
            inicializarArray(novosDados, "horariosDisponiveis")
            if(req.body[key] !== ''){
                novosDados.horariosDisponiveis.push({start: req.body[key]})
            }
            return
        }
        if(key.includes("saidaDepois")){
            inicializarArray(novosDados, "horariosDisponiveis")
            if(req.body[key] !== ''){
                novosDados.horariosDisponiveis[1].end = req.body[key]
            }
            return
        }

        if(key.includes("servico-") || key.includes("servico")){
            inicializarArray(novosDados, "servicos")
            if(req.body[key] !== ''){
                adicionarValorArray(novosDados, "servicos", req.body[key])
            }
            return
        }
        if(key.includes("genero") && req.body[key] == "outro"){
            novosDados.genero = req.body.outroGenero
            return
        }

        if(key !== undefined && key !== null){
            novosDados[key] = req.body[key]
        }
    })
    Barbeiro.findOneAndUpdate(req.user._id, novosDados).then((barbeiro) => {
        res.json({ sucesso: true, message: "Dados alterados com sucesso." })
        return
    }).catch((err) => {
        res.json({ sucesso: false, message: `Houve um erro ao tentar alterar os dados.` })
        return
    })
 })


module.exports = router
