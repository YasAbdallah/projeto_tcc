const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require('../../models/Solicitacao')
const Solicitacao = mongoose.model('solicitacao')
require('../../models/ListaSolicitacaoUsuario')
const ListaSolicitacaoUsuario = mongoose.model('listaSolicitacaoUsuario')
require('../../models/Produto')
const Produto = mongoose.model('produtos')
const {admin} = require("../../helpers/verificarlogin")

router.get('/', admin, async (req, res) => {
    try{
        res.render('admin/solicitacao/index')
    }catch(error){
        req.flash("error_msg", "Houve um erro ao carregar a página. Tente novamente mais tarde")
        res.redirect('/admin')
    }
})

router.post('/', admin, async (req, res) => {
    try{
        const solicitacoes = await ListaSolicitacaoUsuario.where('statusSolicitacao', 0).populate('itens.produto').populate({path:'usuario', select: 'nome'})
        res.json({sucesso: true, solicitacao: solicitacoes})
    }catch(error){
        req.json({sucesso: false, message:"Houve um erro ao carregar os dados."})
    }
})


router.post('/alterar', admin, async (req, res) => {
    try{
        const {idSolicitacao, idProduto, quantidade}  = req.body

        const solicitacao = await ListaSolicitacaoUsuario.findById(idSolicitacao)
        
        if (solicitacao){
            const acharProduto = await Produto.findById(idProduto)
            if(quantidade > acharProduto.saldo){
                res.json({sucesso: false, message: `Valor inválido. Você pode solicitar apenas ${acharProduto.saldo}.`})
            }else{
                const alterarQuantidade = solicitacao.itens.find(item => item.produto.equals(idProduto))
                if (alterarQuantidade) alterarQuantidade.quantidade = quantidade
    
                await solicitacao.save()
                res.json({sucesso: true, message: `Quantidade alterada.`})
            }
        }else{
            res.json({sucesso: false, message: "Não foi possível encontrar a solicitação. Se o problema persistir entre em contato com o administrador."})
        }
        
    }catch(error){
        req.flash('error_msg', 'Ocorreu um erro interno ao tentar retirar produto. Tente Novamente mais tarde, se o erro persistir contate o administrador do sistema.')
        res.redirect('/admin/solicitacao/novas')
    }
})

router.post('/negarItem', admin, async (req, res) => {
    try{
        const {negarProdutoSolicitacao, negarProduto}  = req.body
        
        const solicitacao = await ListaSolicitacaoUsuario.findById(negarProdutoSolicitacao)
        
        if (solicitacao){
            /** Adicionar o statusSolicitacaoProduto
             * Esse novo campo é responsavel para informar o usuario que o produto foi ou não aceito para retirada dos produtos do almoxarifado
             */
            const negarItem = solicitacao.itens.find(item => item.produto.equals(negarProduto))
            
            negarItem.statusSolicitacaoProduto = 2

            await solicitacao.save()
            res.json({sucesso: true, message: `Item negado da solicitação. O usuário não poderá retirar este item.`})
        }else{
            res.json({sucesso: false, message: "Não foi possível encontrar a solicitação. Se o problema persistir entre em contato com o administrador."})
        }
        
    }catch(error){
        req.flash('error_msg', 'Ocorreu um erro interno ao tentar retirar produto. Tente Novamente mais tarde, se o erro persistir contate o administrador do sistema.')
        res.redirect('/admin/solicitacao/novas')
    }
})

router.post('/negarTudo', admin, async (req, res) => {
    try{
        const {negarTodaSolicitacao}  = req.body
        
        const solicitacao = await ListaSolicitacaoUsuario.findById(negarTodaSolicitacao)
        if (solicitacao){
            solicitacao.itens.forEach(element => {
                element.statusSolicitacaoProduto = 2
            });
            solicitacao.statusSolicitacao = 2
            await solicitacao.save()
            res.json({sucesso: true, message: `Status da solicitação alterada para - Retirada Não autorizada.`})
        }else{
            res.json({sucesso: false, message: "Não foi possível encontrar a solicitação. Se o problema persistir entre em contato com o suporte."})
        }
        
    }catch(error){
        req.flash('error_msg', 'Ocorreu um erro interno ao tentar retirar produto. Tente Novamente mais tarde, se o erro persistir contate o suporte do sistema.')
        res.redirect('/admin/solicitacao/novas')
    }
})

router.post('/aceitar', admin, async (req, res) => {
    try{
        const {aceitarSolicitacao}  = req.body
        
        const solicitacao = await ListaSolicitacaoUsuario.findById(aceitarSolicitacao)
        if (solicitacao){
            solicitacao.itens.forEach( async element => {
                const id = element.produto.toString()
                const produto = await Produto.findById({_id: id})
                const novoSaldo = produto.saldo - element.quantidade
                const atualizarSaldo = await Produto.findByIdAndUpdate(id, {saldo: novoSaldo})
                if(element.statusSolicitacaoProduto == 0) element.statusSolicitacaoProduto = 1
            });
            solicitacao.statusSolicitacao = 1
            await solicitacao.save()
            res.json({sucesso: true, message: `Status da solicitação alterada para - Retirada Autorizada.`})
            return
        }else{
            res.json({sucesso: false, message: "Não foi possível encontrar a solicitação. Se o problema persistir entre em contato com o suporte. Código: aceitar-01"})
            return
        }
    }catch(error){
        res.json({sucesso:false, message:'Ocorreu um erro interno ao tentar retirar produto. Tente Novamente mais tarde, se o erro persistir contate o suporte do sistema. Código: aceitar-geral-01'})
        return
    }
})

module.exports = router