import {popup, criarTag} from '../funcoes.js'
import {handleFormSubmit} from './controle.js'
import { construirPaginacao, transicaoLinkPaginacao } from '../paginacao.js'
import {atualizarQuantidadeBotaoCarrinho, listaItensCarrinho} from "./controle.js"

const popupErro = document.getElementById("popupErro")
const paginacao = document.getElementsByClassName("paginacao")[0]

//Atualização do botão carrinho
window.onload = async () => {
    try{
        await construirTabela()
        await handleFormSubmit('adicionarItem', "/solicitar/adicionarItemCarrinho")
        await listaItensCarrinho()
        await atualizarQuantidadeBotaoCarrinho()
        await handleFormSubmit('solicitar', "/solicitar/solicitarItens")
        await handleFormSubmit('removerItem', "/solicitar/removerItemCarrinho")
        await handleFormSubmit('removerTodos', "/solicitar/removerTodosCarrinho")
        await handleFormSubmit('alterarQuantidadeItem', "/solicitar/alterarQuantidadeItem")
    }catch(error){
        popup(popupErro, {sucesso:false, message: `Ocorreu um erro ao recuperar dados do carrinho.`})
    }
}

const construirTabela = async () => {
    const itensTabela = document.getElementById("itensTabela")
    let dados = ''
    if (window.location.href.includes("search")){
        dados = await fetch(`/solicitar/search${window.location.search}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }else{
        dados = await fetch(`/solicitar${window.location.search}`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
    
    if(dados.ok){
        const result = await dados.json()
        result.produtos.forEach(produto => {
            itensTabela.append(construirLinhaProduto(produto))
        })
        const linkPaginas = await construirPaginacao(result.paginas)
        paginacao.append(linkPaginas)
        await transicaoLinkPaginacao()
    }
}

function construirLinhaProduto(dados = {}) {
    const { produto, descricao, observacao, saldo, _id} = dados;

    const trProduto = criarTag('tr');

    const tdProduto = criarTag('td', {}, produto);
    const tdDescricao = criarTag('td', { class: 'text-start text-wrap lh-1' }, descricao);
    const tdObservacao = criarTag('td', {}, observacao);
    
    const tdSaldo = criarTag('td');
    if (!saldo) {
        const btnSaldoInsuficiente = criarTag('button', { class: 'btn btn-warning', 'data-bs-toggle': 'tooltip', 'data-bs-title': 'Saldo insuficiente para inclusão.' });
        const iconSaldoInsuficiente = criarTag('i', { class: 'fa fa-x' });
        btnSaldoInsuficiente.appendChild(iconSaldoInsuficiente);
        tdSaldo.appendChild(btnSaldoInsuficiente);
    } else {
        const form = criarTag('form', { name: 'adicionarItem', 'data-form-id': `adicionarItem_${_id}` });
        const divBtnGroup = criarTag('div', { class: 'btn-group me-2' });
        
        const inputProdutoId = criarTag('input', { type: 'hidden', name: 'produtoId', value: _id });
        const inputQuantidade = criarTag('input', { type: 'number', class: 'form-control pequeno', name: 'quantidade', min: 1, max: saldo, value: 1 });
        
        const btnSubmit = criarTag('button', { type: 'submit', class: 'btn btn-info' });
        const iconSubmit = criarTag('i', { class: 'fa fa-plus' });
        btnSubmit.appendChild(iconSubmit);

        divBtnGroup.append(inputProdutoId, inputQuantidade, btnSubmit);
        form.appendChild(divBtnGroup);
        tdSaldo.appendChild(form);
    }

    trProduto.append(tdProduto, tdDescricao, tdObservacao, tdSaldo);

    return trProduto;
}