const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../../models/Produto')
const Produto = mongoose.model('produtos')
const {admin} = require("../../helpers/verificarlogin")
const {paginacao} = require("../../helpers/paginacao")
const {validarCampo, normalizeText} = require("../../helpers/funcoes")


router.get('/', admin, async (req, res) => {
    try{
        res.render('admin/produto/index')
    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        req.redirect("/admin")
    }
})

router.post('/', admin, async (req, res) => {
    try{
        const {pag, itensPorPagina} = req.query
        const pagina = Number(pag)
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)

        //Buscar os produtos paginados
        const produtos = await Produto.find().skip((pagina - 1) * limite).limit(limite).sort({"produto": "ASC"})
        
        //capturando total de itens no BD
        const totalItens = await Produto.countDocuments()
        //Calculando Paginação
        const paginas = await paginacao('/admin/produto', pagina, limite, totalItens)
        res.json({produtos, paginas})
    }catch(error){
        res.json({sucesso: false, message:"Houve um erro ao tentar carregar os dados."})
    }
})

router.get('/search', admin, async (req, res) => {
    try{
        res.render('admin/produto/index')
    }catch(error){
        req.flash("error_msg", "Houve um erro ao tentar carregar os dados.")
        req.redirect("/admin")
    }
})

router.post('/search', admin, async (req, res) => {
    try{
        const {pag, itensPorPagina} = req.query
        const pagina = Number(pag)
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const pesquisa = req.query.query.toLowerCase().split(' ')[0]
        const termoNormalizado = normalizeText(pesquisa)
        
        //Buscar os produtos paginados
        const produtos = await  Produto.find({
            $or:[
                {produto: {$regex: pesquisa, $options: "i"}},
                {produto: {$regex: termoNormalizado, $options: "i"}},
                {codigo: {$regex: pesquisa, $options: "i"}}
            ]
        }).skip((pagina - 1) * limite).limit(limite).sort({"produto": "ASC"})
        
        //capturando total de itens no BD
        const totalItens = await Produto.countDocuments({
            $or:[
                {produto: {$regex: pesquisa, $options: "i"}},
                {produto: {$regex: termoNormalizado, $options: "i"}},
                {descricao: {$regex: pesquisa, $options: "i"}},
                {descricao: {$regex: termoNormalizado, $options: "i"}},
                {codigo: {$regex: pesquisa, $options: "i"}}
            ]
        })
        //Calculando Paginação
        const paginas = paginacao('/admin/produto', pagina, limite, totalItens)
        res.json({produtos, paginas})

    }catch(error){
        res.json({sucesso: false, message:"Houve um erro ao tentar carregar os dados."})
    }
})

router.post("/add", admin, async (req, res) => {
    const {codigo, produto, descricao, observacao, saldo} = req.body

    const produtoDuplicado = await Produto.find({codigo: codigo})
    if (produtoDuplicado.length > 0) {
        
        res.json({sucesso: false, message: "Código do produto já existe. Tente outro."})
        return
    }
    

    const validacoes = [
        {campo: codigo, mensagem: "Código do produto inválido."},
        {campo: produto, mensagem: "Nome do produto inválido."},
        {campo: descricao, mensagem: "Descrição do produto inválido."},
        {campo: observacao, mensagem: "As Observações do produto está inválido."},
        {campo: saldo, mensagem: "O Saldo do produto inválido."},
    ] 

    validacoes.forEach((campo, mensagem) => {
        const erro = validarCampo(campo, mensagem)
        if (erro){
            res.json({sucesso: false, message: erro})
            return
        }
    })
    try {
        const novoProduto = {
            codigo: codigo,
            produto: produto.toLowerCase(),
            descricao: descricao.toLowerCase(),
            observacao: observacao.toLowerCase(),
            saldo: saldo
        }
        await new Produto(novoProduto).save()
        res.json({sucesso:true, message:"Produto adicionado com Sucesso!"})
        return
    } catch (error) {
        res.json({sucesso:false, message:"Ocorreu um erro ao tentar Adicionar um novo produto"})
        return 
    }
})

router.post('/alterar', admin, async (req, res) => {
    try{
        const {id, codigo, produto, saldo, descricao, observacao} = req.body
        const validacoes = [
            {campo: codigo, mensagem: "Código do produto inválido."},
            {campo: produto, mensagem: "Nome do produto inválido."},
            {campo: descricao, mensagem: "Descrição do produto inválido."},
            {campo: observacao, mensagem: "As Observações do produto está inválido."},
            {campo: saldo, mensagem: "O Saldo do produto inválido."},
        ]

        validacoes.forEach((campo, mensagem) => {
            const erro = validarCampo(campo, mensagem)
            if (erro){
                res.json({sucesso: false, message: erro})
                return
            }
        })
        const alterarProduto = {
            produto: produto.toLowerCase(),
            codigo: codigo,
            descricao: descricao.toLowerCase(),
            observacao: observacao.toLowerCase(),
            saldo: saldo
        }
        try{
            await Produto.findByIdAndUpdate(id, alterarProduto)
            res.json({sucesso:true, message:"Produto atualizado com sucesso!"})
        }catch(error){
            res.json({sucesso: false, message:'Houve um erro ao alterar algum dos valores do produto. Tente novamente mais tarde.'})

        }
        
        
        
    }catch(error){
        req.flash('error_msg', 'Ocorreu um erro interno ao tentar retirar produto. Tente Novamente mais tarde, se o erro persistir contate o administrador do sistema.')
        res.redirect('/admin/solicitacao/novas')
    }
})

router.post("/remover", admin, async (req, res) => {
    try{
        const {id} = req.body

        await Produto.findByIdAndRemove(id)
        res.json({sucesso:true, message:"Produto removido com sucesso."})
    }catch(error) {
        res.json({sucesso:false, message:"Erro ao tentar Remover o produto."})
        return
    }
})

module.exports = router
