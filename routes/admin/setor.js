const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../../models/Setor')
const Setor = mongoose.model('setor')
const {admin} = require("../../helpers/verificarlogin")
const {validarCampo} = require("../../helpers/funcoes")
const {paginacao} = require("../../helpers/paginacao")

router.get("/", admin, async (req, res) => {
    try{
        res.render("admin/setor/index")
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar os dados. Tente novamente mais tarde")
        res.redirect('/admin')
    }
})

router.post("/", admin, async (req, res) => {
    try{
        const setor = await Setor.find()
        res.json({sucesso: true, setor: setor})
        return
    }catch(error){
        req.json({sucesso:false, message: "Houve um erro ao carregar os dados dos setores. Tente novamente mais tarde."})
        return
    }
})

router.post("/alterar", admin, async (req, res) => {
    const {id, nomeSetor, sigla, descricao} = req.body
    const verificacoes = [
        {campo: nomeSetor, mensagem: "Nome do setor inválido."},
        {campo: sigla, mensagem: "Sigla do setor inválido."},
        {campo: descricao, mensagem: "Descrição do setor inválido."},
    ]

    verificacoes.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro){
            res.json({sucesso: false, message: erro})
            return
        }
    })
    try{
        await Setor.updateOne(
            {_id: id},
            {
                nomeSetor: nomeSetor, 
                sigla: sigla,
                descricao: descricao,
            }
        )
        res.json({sucesso:true, message:"Dados do Setor alterado com sucesso."})
        return 
    }catch(error){

        res.json({sucesso:false, message:"Erro ao tentar Alterar os dados do setor."})
        return
    }
})

router.post("/remover", admin, async (req, res) => {
    const {id} = req.body

    try{
        await Setor.findByIdAndRemove(id)
        res.json({sucesso:true, message:"Setor removido com sucesso."})
        return 
    }catch(error){

        res.json({sucesso:false, message:"Erro ao tentar Remover o setor."})
        return
    }
})

router.post("/criar", admin, async (req, res) => {
    const {nomeSetor, sigla, descricao} = req.body

    try{
        await Setor({nomeSetor, sigla, descricao}).save()
        res.json({sucesso:true, message:"Setor removido com sucesso."})
        return 
    }catch(error){

        res.json({sucesso:false, message:"Erro ao tentar Remover o setor."})
        return
    }
})
module.exports = router
