const express = require('express')
const mongoose = require("mongoose")
require('../../models/Produto')
const Produto = mongoose.model('produtos')
require('../../models/Carrinho')
const Carrinho = mongoose.model('carrinho')
require('../../models/ListaSolicitacaoUsuario')
const Solicitacao = mongoose.model('listaSolicitacaoUsuario')
const router = express.Router()
const {logado} = require("../../helpers/verificarlogin")
const {paginacao, paginacaoPesquisa} = require("../../helpers/paginacao")
const {normalizeText, gerarIdentificadorRequisicao} = require("../../helpers/funcoes")

router.get('/', logado, async (req, res) => {
    try{
        res.render('solicitar/index')
    }catch(error){
        req.flash("error_msg", `Houve um erro ao tentar carregar os dados. Código: solicitar-01`)
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
        const produtos = await Produto.find().skip(indiceItemPagina).limit(limite).sort({"produto": "ASC"})
        
        //capturando total de itens no BD
        const totalItens = await Produto.countDocuments()
        //Calculando Paginação
        const paginas = await paginacao('/solicitar', pagina, limite, totalItens)
        res.json({produtos, paginas})

    }catch(error){
        req.json({sucesso: true, message:`Houve um erro ao tentar carregar os dados. Código: solicitar-01`})
    }
})

router.get('/search', logado, async (req, res) => {
    try{
        res.render('solicitar/index')
    }catch(error){
        req.flash("error_msg", `Houve um erro ao tentar carregar os dados. Código: solicitar-search-01`)
        res.redirect("/")
    }
})

router.post('/search', logado, async (req, res) => {
    try{
        const pagina = req.query.pag || 1
        const itensPorPagina = req.query.itensPorPagina || 15
        const limite = itensPorPagina == undefined || itensPorPagina == 0 ? 15 : Number(itensPorPagina)
        const indiceItemPagina = (pagina - 1) * limite
        const pesquisa = req.query.produto.toLowerCase().split(" ")[0]
        const termoNormalizado = normalizeText(pesquisa)
        //Buscar os produtos paginados
        const produtos = await Produto.find({
            $or:[
                {produto: {$regex: pesquisa, $options: "i"}},
                {produto: {$regex: termoNormalizado, $options: "i"}},
                {descricao: {$regex: pesquisa, $options: "i"}},
                {descricao: {$regex: termoNormalizado, $options: "i"}},
                {codigo: {$regex: pesquisa, $options: "i"}}
            ]
        }).skip(indiceItemPagina).limit(limite).sort({"produto": "ASC"})
        
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
        const paginas = await paginacaoPesquisa('/solicitar', pesquisa, pagina, limite, totalItens)
        
        res.json({produtos, paginas})

    }catch(error){
        res.json({sucesso: false, message:"Houve um erro ao tentar carregar os dados. Código: solicitar-search-02"})

    }
})

router.post("/adicionarItemCarrinho", logado, async (req, res) => {
    try{
        const {produtoId, quantidade} = req.body
        const usuario = req.user.id
        const listaCarrinho = {
            usuario: usuario,
            itens: [{
                produto: produtoId,
                quantidade: quantidade,
            }]
        }
        let carrinhoBD = await Carrinho.findOne({usuario: usuario})
        if(!carrinhoBD){
            carrinhoBD = await new Carrinho(listaCarrinho)
        }else{
            const itemExistecarrinho = carrinhoBD.itens.find(item => item.produto.equals(produtoId))
            if(itemExistecarrinho){
                itemExistecarrinho.quantidade = quantidade
            }else{
                carrinhoBD.itens.push({produto: produtoId, quantidade: quantidade})
            }
        }
        await carrinhoBD.save()
        const totalItensCarrinho = carrinhoBD.itens.length
        res.json({sucesso: true, message: 'Adicionado ao carrinho.', totalItensCarrinho: totalItensCarrinho})
        return
    }catch(error){
        res.json({sucesso: false, message: 'Ocorreu um erro ao tentar adicionar o item no carrinho. Código: Cart-add-01'})
        return
    }
})

router.post("/alterarQuantidadeItem", logado, async (req, res) => {
    try{
        const {alterarProduto, quantidade} = req.body
        const usuario = req.user.id
        let carrinhoBD = await Carrinho.findOne({usuario: usuario})
        if(carrinhoBD){
            const itemExistecarrinho = carrinhoBD.itens.find(item => item._id.equals(alterarProduto))
            if(itemExistecarrinho){
                itemExistecarrinho.quantidade = quantidade
            }
        }
        const atualizado = await carrinhoBD.save()
        const totalItensCarrinho = carrinhoBD.itens.length
        res.json({sucesso: true, message: 'Saldo atualizado.', totalItensCarrinho: totalItensCarrinho})
        return
    }catch(error){
        res.json({sucesso: false, message: 'Ocorreu um erro ao tentar alterar a quantidade do item do carrinho. Código: Cart-alt-01'})
        return
    }
})

router.post("/removerItemCarrinho", logado, async (req, res) => {
    try{
        const {removerProduto} = req.body
        const usuario = req.user.id
        let carrinhoBD = await Carrinho.findOne({usuario: usuario})
        if(carrinhoBD){
            carrinhoBD.itens = carrinhoBD.itens.filter(item => !item._id.equals(removerProduto));
        }
        await carrinhoBD.save()
        res.json({sucesso: true, message: 'Item removido do carrinho.', totalItensCarrinho: carrinhoBD.itens.length})
        return

    }catch(error){
        res.json({sucesso: false, message: 'Ocorreu um erro ao tentar alterar a quantidade do item do carrinho. Código: Cart-rm-01'})
        return

    }
})

router.post("/removerTodosCarrinho", logado, async (req, res) => {
    try{
        const usuario = req.user.id
        let carrinhoBD = await Carrinho.findOneAndRemove({usuario: usuario})
        res.json({sucesso: true, message: 'O carrinho está limpo.'})
        return
    }catch(error){
        res.json({sucesso: false, message: 'Ocorreu um erro ao tentar remover os itens do carrinho. Código: Cart-rm-02'})
        return
    }
})

router.post("/solicitarItens", logado, async (req, res) => {
    try{
        const usuario = req.user.id
        const carrinhoBD = await Carrinho.findOne({usuario: usuario})
        if(carrinhoBD.length === 0){
            res.json({sucesso: false, message: "Não há produtos no carrinho para solicitação."})
            return
        }else{
            
            const produtos = {
                itens: carrinhoBD.itens,
                usuario: usuario,
                identificador: gerarIdentificadorRequisicao()
            }
            let identificadorExiste = true
            while (identificadorExiste){
                produtos.identificador = gerarIdentificadorRequisicao()
                identificadorExiste = await Solicitacao.findOne({identificador: produtos.identificador})
            }
            const novaSolicitacao = await new Solicitacao(produtos)
            novaSolicitacao.save()

            
            const deletarCarrinho = await Carrinho.deleteOne({usuario: usuario})
            
            res.json({sucesso: true, message: 'Solicitação realizada.'})
            return
        }
    }catch(error){
        res.json({sucesso: false, message: 'Ocorreu um erro ao tentar realizar solicitação dos itens do carrinho. Código: Cart-soli-01'})
        return
    }
})

/**Pega dadas para quantidade de itens para o botão do carrinho */
router.post("/quantidadeItensBotaoCarrinho", logado, async (req, res) => {
    try{
        const totalItensCarrinho = await Carrinho.findOne({usuario: req.user.id})
        if(!totalItensCarrinho || totalItensCarrinho.itens.length === 0){
            res.json({sucesso: true, totalItensCarrinho: 0})
            return
        }else{
            res.json({sucesso: true, totalItensCarrinho: totalItensCarrinho.itens.length})
            return
        }
    }catch(error){
        res.json({sucesso: false, message: "Ocorreu um erro ao tentar recuperar o carrinho. Código: Cart-item-01"})
        return
    }
})
/**Paga todos os dados para criação da tabela dos itens no carrinho */
router.get("/conteudoCarrinho", logado, async (req, res) => {
    try{
        const conteudo = await Carrinho.findOne({usuario: req.user.id}).populate("itens.produto")
        if(conteudo){
            res.json({sucesso: true, conteudo: conteudo.itens})
            return
        }
    }catch(error){
        res.json({sucesso: false, message: `Ocorreu um erro ao atualizar a lista de itens no carrinho. Código: Cart-cont-03 `})
        return
    }
})

module.exports = router