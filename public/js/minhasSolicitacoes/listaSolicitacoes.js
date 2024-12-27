import {handleFormSubmit} from "./controle.js"
import {popup, formatarData, criarTag} from "../funcoes.js"
import {construirPaginacao, transicaoLinkPaginacao} from "../paginacao.js"

const paginacao = document.getElementsByClassName("paginacao")[0]
window.onload = async ()=> {
    await contruirSection()
    await handleFormSubmit('confirmarRetidada', '/solicitacoes/confirmarRetidada')
}

const contruirSection = async () => {
    const sectionSolicitaoes = document.getElementById("listaSolicitacoes")
    const armazemModal = document.getElementById("armazemModal")
    let dados = ''
    if (window.location.href.includes("search")){
        dados = await fetch(`/minhasSolicitacoes/search${window.location.search}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }else{
        dados = await fetch(`/minhasSolicitacoes/${window.location.search}`, {
            method:"post",
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
    if(dados.ok){
        const result = await dados.json()
        const linkPaginas = await construirPaginacao(result.paginas)
        paginacao.append(linkPaginas)
        await transicaoLinkPaginacao()
        result.solicitacao.forEach(solicitacoes => {
            sectionSolicitaoes.append(construirCard(solicitacoes))
            armazemModal.append(construirModal(solicitacoes))
        })
    }else{
        popup(popupErro, {success: false, message: "Ocorreu um erro ao recuperar as listas de solicitações"})
    }
}

const construirCard = (dados = {}) => {
    const {_id, statusSolicitacao, statusRetirada, data, dataRetirada, identificador} = dados
    const dataSolicita = formatarData(data)
    const dataRetira = !dataRetirada ? "" : formatarData(dataRetirada)
    let borda, textoStatusSolicitacao = ""
    let visibilidadeBotao = false
    if (statusSolicitacao == 0) {
        textoStatusSolicitacao = 'Aguardando confirmação do administrador.'
        borda = "border border-warning"
        visibilidadeBotao = true
    }
    if (statusSolicitacao == 1){
        textoStatusSolicitacao = 'Solicitação autorizada. Aguardando retirada.'
        borda = "border border-success"
        visibilidadeBotao = false
        if(statusRetirada) visibilidadeBotao = true
    }
    if (statusSolicitacao == 2) {
        textoStatusSolicitacao = 'Solicitação Não autorizada.'
        borda = "border border-danger"
        visibilidadeBotao  = true
    }
    if(statusRetirada){
        textoStatusSolicitacao = "Solicitação retirada."
        borda = "border border-info"
    }
    const card = criarTag('section', {class: `card card-lista-solicitacao ${borda} ms-3 mb-3`})
    const body = criarTag('section', {class: "card-body"})
    const tituloCard = criarTag('h4', {class:'card-title text-start'})
    
    const numeroRequisicao = criarTag('span', {class: 'fw-bold fs-3'}, `Nº. de Requisição: ${identificador}`)
    // 0 == Em Status em espera de autorização | 1 == Em Status de aguardando retirada | 2 == Em status de solicitação negada.
    
    const status = criarTag('span', {class: 'fw-bold fs-3'}, `Status: ${textoStatusSolicitacao}`)

    tituloCard.append(numeroRequisicao, document.createElement('hr'), status)

    const divAcoes = criarTag('div', {class: 'btn-group'})
    const btnVerProdutos = criarTag('button', {class: 'btn btn-outline-secondary btn-lg m-3 position-relative rounded', "data-bs-toggle":"modal", "data-bs-target":`#ListaItens_${_id}`}, "Ver Produtos")
    const btnConfirmarRetirada = criarTag('button', {class:"btn btn-outline-success m-3 position-relative rounded", id:_id}, `Confirmar retirada`)
    const inputConfirma = criarTag('input', {type:"hidden", name:"numeroReq", value:_id})
    divAcoes.append(btnVerProdutos)
    if(!visibilidadeBotao){
        const formConfirmarRetirada = criarTag('form', {name: "confirmarRetidada", 'data-form-id':`confirmarRetirada_${_id}`}) 
        formConfirmarRetirada.append(inputConfirma, btnConfirmarRetirada)
        divAcoes.append(formConfirmarRetirada)
    }

    const pData1 = criarTag('p', { class: "card-text mt-3" }, `Solicitação realizada em: ${dataSolicita}`);
    let pData2
    if(statusRetirada){
        pData2 = criarTag('p', { class: "card-text mt-3"}, `Solicitação retirada em: ${dataRetira}`);
    }else{
        pData2 = criarTag('span');
    }
    
    const spanData1 = criarTag('span', { name: "data" });
    const spanData2 = criarTag('span', { name: "data" });

    pData1.appendChild(spanData1)
    pData2.appendChild(spanData2)

    body.append(tituloCard, divAcoes, pData1, document.createElement('hr'), pData2)
    
    card.appendChild(body)
    return card
}

const construirModal = (dados = {}, produtos = {}) =>{
    const {_id, itens, identificador} = dados
    
    const modalContainer = criarTag("section", {class: "modal fade", id: `ListaItens_${_id}`, tabindex:"-1", "arial-labelledby":`ListaItens_${_id}Label`, "aria-hidden":"true"})
    const modalDialog = criarTag("div", {class:"modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"})
    const modalContent = criarTag("div", {class:"modal-content"})
    const modalHeader = criarTag("div", {class:"modal-header"})
    const title = criarTag("h1", {class:"modal-title fs-5", id:`ListaItens_${_id}Label`}, `Nº de Requisição: ${identificador}`)
    const buttonClose = criarTag("button", {class:"btn-close", 'data-bs-dismiss':"modal", "aria-label":"Close"})

    modalHeader.append(title, buttonClose)

    const modalBody = criarTag('div', {class: "modal-body"})
    const table = criarTag('table', {class: "table table-striped table-hover table-sm align-middle"})
    const thead = criarTag('thead')
    const tr = criarTag('tr')
    let texto = ["Produto", "Descrição", "Obs.", "Qnt."]
    for (let index = 0; index < 4; index++) {
        const td = criarTag('td', {}, texto[index])
        tr.appendChild(td)
    }
    thead.append(tr)

    const tbody = criarTag("tbody")
    itens.forEach(produto => {
        const tr = criarTag("tr")
        tr.append(criarTag('td', {}, produto.produto.produto), criarTag('td', {}, produto.produto.descricao), criarTag('td', {}, produto.produto.observacao), criarTag('td', {}, produto.quantidade))
        tbody.append(tr)
    })
    const divFooter = criarTag('div', {class: "modal-footer"})
    const btnSair = criarTag('button', {class: 'btn btn-secondary', "data-bs-dismiss": "modal"}, "Sair")

    divFooter.append(btnSair)
    table.append(thead, tbody)
    modalBody.append(table, divFooter)
    modalContent.append(modalHeader, modalBody)
    modalDialog.append(modalContent)
    modalContainer.append(modalDialog)

    return modalContainer
}