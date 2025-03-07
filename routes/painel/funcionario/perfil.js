const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
const {admin} = require("../../../helpers/verificarlogin")
const {validarCampo} = require("../../../helpers/funcoes")

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
            if(!Array.isArray(novosDados.diasDisponiveis)){
                novosDados.diasDisponiveis = []
            }
            novosDados.diasDisponiveis.push(req.body[key])
            return
        }
        if(key.includes("servico-") || key.includes("servico")){
            if(!Array.isArray(novosDados.servicos)){
                novosDados.servicos = []
            }
            if(req.body[key] !== ''){
                novosDados.servicos.push(req.body[key])
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
    console.log("novosDados: ", novosDados)
      
    // TODO: Implementar a função de atualizar os dados do barbeiro.
    /*Barbeiro.findOneAndUpdate(req.user._id, novosDados).then((barbeiro) => {
        res.json({ sucesso: true, message: "Dados alterados com sucesso." })
    }).catch((err) => {
        console.log(err)
        res.json({ sucesso: false, message: `Houve um erro ao tentar alterar os dados.` })
        return
    })*/
 })


module.exports = router
