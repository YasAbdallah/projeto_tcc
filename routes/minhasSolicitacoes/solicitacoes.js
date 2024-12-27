const express = require('express')
const mongoose = require("mongoose")
require('../../models/ListaSolicitacaoUsuario')
const ListaSolicitacaoUsuario = mongoose.model('listaSolicitacaoUsuario')
const router = express.Router()
const {logado} = require("../../helpers/verificarlogin")
const {paginacao, paginacaoPesquisa} = require("../../helpers/paginacao")
const { normalizeText } = require('../../helpers/funcoes')

router.get('/', logado, async (req, res) => {
    try{
        res.render('minhasSolicitacoes/index')
    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

router.post('/', logado, async (req, res) => {
    try{
        const {pag, itensPorPag} = req.query
        const pagina = pag || 1
        const itensPorPagina = itensPorPag || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite

        //Buscar os produtos paginados
        const solicitacao = await ListaSolicitacaoUsuario.find({'usuario': req.user.id})
        .select('-saldo').populate("itens.produto").skip(indiceItemPagina).limit(limite).sort({'data': "ASC"})
        //capturando total de itens no BD
        const totalItens = await ListaSolicitacaoUsuario.countDocuments({'usuario': req.user.id})
        //Calculando Paginação
        const paginas = await paginacao('/minhasSolicitacoes', pagina, limite, totalItens)
        res.json({solicitacao, paginas})
        return
    }catch(error){
        res.json({sucesso:false, message:"Houve um erro ao tentar carregar os dados das minhas solicitações."})
        return
    }
})

router.get('/search', logado, async (req, res) => {
    try{
        res.render('minhasSolicitacoes/index')

    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

router.post('/search', logado, async (req, res) => {
    try{
        const {pag, itensPorPag, query} = req.query
        const pagina = pag || 1
        const itensPorPagina = itensPorPag || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite
        const pesquisa = query.toUpperCase().split(" ")[0]
        const termoNormalizado = normalizeText(pesquisa)
        //Buscar os produtos paginados
        const solicitacao = await ListaSolicitacaoUsuario.find({
            $or:[
                {identificador: {$regex: pesquisa, $options: "i"}},
                {identificador: {$regex: termoNormalizado, $options: "i"}}
            ]
        }).select('-saldo').populate("itens.produto").skip(indiceItemPagina).limit(limite).sort({'data': "ASC"})
        //capturando total de itens no BD
        const totalItens = await ListaSolicitacaoUsuario.countDocuments({
            $or:[
                {identificador: {$regex: pesquisa, $options: "i"}},
                {identificador: {$regex: termoNormalizado, $options: "i"}}
            ]
        })
        //Calculando Paginação
        const paginas = await paginacaoPesquisa('/minhasSolicitacoes', pesquisa, pagina, limite, totalItens)
        res.json({solicitacao, paginas})
        return
    }catch(error){
        res.json({sucesso:"error_msg", message:"Houve um erro ao tentar carregar os dados da pesquisa."})
        return
    }
})


router.get('/listaProdutos', logado, async (req, res) => {
    try{
        //Buscar os produtos paginados
        const solicitacao = await ListaSolicitacaoUsuario.find({usuario: req.user.id}).populate('itens.produto').sort({'data': "DESC"})
        
        res.json({sucesso: true, solicitacoes: solicitacao})

    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        res.redirect("/")
    }
})

router.post('/confirmarRetidada', logado, async (req, res) => {
    try{
        const {numeroReq} = req.body
        const confirmarSolicitacao = await ListaSolicitacaoUsuario.findByIdAndUpdate(numeroReq, {statusRetirada: true, dataRetirada: Date.now()})
        res.json({sucesso: true, message:"Retirada confirmada."})
        return
    }catch(error){
        res.json({sucesso: false, message:error})
        return
    }
})

module.exports = router