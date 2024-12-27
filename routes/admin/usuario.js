const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../../models/Setor')
const Setor = mongoose.model('setor')
require('../../models/Usuario')
const Usuario = mongoose.model('usuario')
const {admin} = require("../../helpers/verificarlogin")
const {validarCampo} = require("../../helpers/funcoes")

router.get("/", admin, async (req, res) => {
    try{
        /* Remover isso após a construção da tabela. */
        const usuarios = await Usuario.find().select('-senha').populate('secao')

        res.render("admin/usuarios/index", {usuarios})
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar os dados. Tente novamente mais tarde.")
        res.redirect('/admin')
    }
})

router.post("/", admin, async (req, res) => {
    try{
        const usuarios = await Usuario.find().select('-senha').populate('secao')
        
        const setores = await Setor.find().select('-descricao')

        res.json({sucesso: true, usuarios: usuarios, setores: setores})
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar os dados. Tente novamente mais tarde")
        res.redirect('/admin')
    }
})

router.post("/alterar", admin, async (req, res) => {
    const {id_alterar, nome, sobrenome, cpf, setor, tipoUsuario} = req.body
    const verificacoes = [
        {campo: nome, mensagem: "Nome do usuário inválido."},
        {campo: sobrenome, mensagem: "Sobrenome do usuário inválido."},
        {campo: cpf, mensagem: "CPF do usuário inválido."},
        {campo: setor, mensagem: "Setor inválida, registre um setor para continuar."},
        {campo: tipoUsuario, mensagem: "Tipo de usuário inválida, selecione um tipo para continuar."},
    ]

    verificacoes.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro){
            res.json({sucesso: false, message: erro})
            return
        }
    })
    try{
        await Usuario.updateOne(
            {_id: id_alterar},
            {
                nome: nome, 
                sobrenome: sobrenome,
                cpf: cpf,
                secao: setor, 
                tipoUsuario: tipoUsuario
            }
        )
        res.json({sucesso:true, message:"Usuário alterado com sucesso."})
        return 
    }catch(error){
        res.json({sucesso:false, message:"Erro ao tentar Alterar o usuário."})
        return
    }
})

router.post("/remover", admin, async (req, res) => {
    const {id} = req.body
    try{
        await Usuario.updateOne(
            {_id: id},
            { 
                visibilidade: 0,
                senha: "Trocar@$1234",
                senhaAlterada: false
            }
        )
        res.json({sucesso:true, message:"Usuário removido com sucesso."})
        return 
    }catch(error){
        res.json({sucesso:false, message:"Erro ao tentar removido o usuário."})
        return 
    }
})

router.post("/aprovar", admin, async (req, res) => {
    const {id, nome, sobrenome, cpf, setor, tipoUsuario} = req.body
    const verificacoes = [
        {campo: nome, mensagem: "Nome do usuário inválido."},
        {campo: sobrenome, mensagem: "Sobrenome do usuário inválido."},
        {campo: cpf, mensagem: "CPF do usuário inválido."},
        {campo: setor, mensagem: "Setor inválida, registre um setor para continuar."},
        {campo: tipoUsuario, mensagem: "Tipo de usuário inválida, selecione um tipo para continuar."},
    ]

    verificacoes.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro){
            res.json({sucesso: false, message: erro})
            return
        }
    })
    try{
        await Usuario.updateOne(
            {_id: id},
            {
                nome: nome, 
                sobrenome: sobrenome,
                cpf: cpf,
                secao: setor, 
                tipoUsuario: tipoUsuario,
                aprovado: 1
            }
        )
        res.json({sucesso:true, message:"Usuário Aprovado com sucesso."})
        return 
    }catch(error){
        res.json({sucesso:false, message:"Erro ao tentar Aprovar o usuário."})
        return
    }
})

router.post("/negar", admin, async (req, res) => {
    const {id} = req.body
    try{
        await Usuario.findByIdAndDelete(id)
        res.json({sucesso:true, message:"Solicitação Negada com sucesso."})
        return 
    }catch(error){
        res.json({sucesso:false, message:"Erro ao tentar negar solicitação do usuário."})
        return 
    }
})

module.exports = router
