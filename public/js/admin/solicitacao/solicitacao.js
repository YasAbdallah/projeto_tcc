import {popup, formatarData} from "../../funcoes.js"
import {handleFormSubmit} from "./controle.js"

const popupSucesso = document.getElementById("popupSucesso")
const popupErro = document.getElementById("popupErro")

window.onload = async () => {
    try{
        await contruirSection()
        await handleFormSubmit("alterarQuantidadeItem", "/admin/solicitacao/alterar")
        await handleFormSubmit("negarItem", "/admin/solicitacao/negarItem")
        await handleFormSubmit("negarTudo", "/admin/solicitacao/negarTudo", true)
        await handleFormSubmit("aceitarSolicitacao", "/admin/solicitacao/aceitar", true)
    }catch(error){
        popup(popupErro, {sucesso:false, message: `Ocorreu um erro ao recuperar dados das solicitações.`})
    }
}

const contruirSection = async () =>{
    
    const sectionSolicitaoes = document.getElementById("listaSolicitacoes")
    const armazemModal = document.getElementById("armazemModal")
    const listaSolicitacoes = await fetch('/admin/solicitacao', {
        method:"post",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if(listaSolicitacoes.ok){
        const result = await listaSolicitacoes.json()
        result.solicitacao.forEach(solicitacoes => {
            let dados = new Object()
            let dadosModal = new Array()
            solicitacoes.itens.forEach(itens => {
                delete itens.produto.saldo
                itens.produto.quantidade = itens.quantidade
                itens.produto.statusSolicitacaoProduto = itens.statusSolicitacaoProduto
                dados = {
                    numeroReq: solicitacoes._id,
                    usuario: solicitacoes.usuario.nome,
                    statusSolicitacao: solicitacoes.statusSolicitacao,
                    dataSolicitacao: solicitacoes.data,
                    identificador: solicitacoes.identificador
                }
                //Enviar itens completo para modal
                dadosModal.push(itens.produto)
            })
            sectionSolicitaoes.append(construirCard(dados))
            armazemModal.append(construirModal(dados, dadosModal))
        })
    }else{
        popup(popupErro, {success: false, message: "Ocorreu um erro ao recuperar as listas de solicitações"})
    }
}

const construirCard = (dados = {}) => {
    const {numeroReq, usuario, dataSolicitacao, identificador} = dados
    const dataSolicita = formatarData(dataSolicitacao)
    const card = criarTag('section', {class: `card card-lista-solicitacao ms-3 mb-3`})
    const body = criarTag('section', {class: "card-body"})
    const tituloCard = criarTag('h4', {class:'card-title text-start'})
    
    const numeroRequisicao = criarTag('p', {class: 'fw-bold fs-4'}, `Nº. de Requisição: ${identificador}`)
    const usuarioRequisicao = criarTag('p', {class: 'fw-bold fs-6'}, `Solicitante: ${usuario}`)
    
    tituloCard.append(numeroRequisicao, usuarioRequisicao, document.createElement('hr'))

    const divAcoes = criarTag('div', {class: 'btn-group'})
    const btnVerProdutos = criarTag('button', {class: 'btn btn-outline-secondary btn-lg m-3 position-relative rounded', "data-bs-toggle":"modal", "data-bs-target":`#ListaItens_${numeroReq}`}, "Ver Produtos")
    divAcoes.append(btnVerProdutos)

    const pData1 = criarTag('p', { class: "card-text mt-3" }, `Solicitação realizada em: ${dataSolicita.dataLocal} às ${dataSolicita.horaLocal}`);
    const spanData1 = criarTag('span', { name: "data" });

    pData1.appendChild(spanData1)

    body.append(tituloCard, divAcoes, pData1)
    
    card.appendChild(body)
    return card
}

const construirModal = (dados = {}, produtos = {}) =>{
    const modalContainer = criarTag("section", {class: "modal fade", id: `ListaItens_${dados.numeroReq}`, tabindex:"-1", "arial-labelledby":`ListaItens_${dados.numeroReq}Label`, "aria-hidden":"true"})
    const modalDialog = criarTag("div", {class:"modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"})
    const modalContent = criarTag("div", {class:"modal-content"})
    const modalHeader = criarTag("div", {class:"modal-header"})
    const title = criarTag("h1", {class:"modal-title fs-5", id:`ListaItens_${dados.numeroReq}Label`}, `Solicitação de : ${dados.usuario}`)
    const buttonClose = criarTag("button", {class:"btn-close", 'data-bs-dismiss':"modal", "aria-label":"Close"})

    modalHeader.append(title, buttonClose)

    const modalBody = criarTag('div', {class: "modal-body"})
    const table = criarTag('table', {class: "table table-striped table-hover table-sm align-middle"})
    const thead = criarTag('thead')
    const tr = criarTag('tr')
    let texto = ["Produto", "Descrição", "Obs.", "Qnt.", "Negar"]
    for (let index = 0; index < texto.length; index++) {
        const td = criarTag('td', {}, texto[index])
        tr.appendChild(td)
    }
    thead.append(tr)

    const tbody = criarTag("tbody")
    produtos.forEach(produto => {
        const tr = criarTag("tr")
        const tdQuantidade = criarTag('td')
        const tdRemover = tdQuantidade.cloneNode()
        const formQuantidade = construirFormAlterarQuantidade(produto.quantidade, dados.numeroReq, produto._id)
        const formRemover = construirFormNegarItem(dados.numeroReq, produto._id, produto.statusSolicitacaoProduto)
        tdQuantidade.append(formQuantidade)
        tdRemover.append(formRemover)
        tr.append(criarTag('td', {}, produto.produto), criarTag('td', {}, produto.descricao), criarTag('td', {}, produto.observacao), tdQuantidade, tdRemover)
        tbody.append(tr)
    })
    const divFooter = criarTag('div', {class: "modal-footer"})
    const formNegarTudo = construirFormNegarTudo(dados.numeroReq)
    const formAceitarSolicitacao = construirFormAceitarSolicitacao(dados.numeroReq)

    divFooter.append(formAceitarSolicitacao, formNegarTudo)
    table.append(thead, tbody)
    modalBody.append(table, divFooter)
    modalContent.append(modalHeader, modalBody)
    modalDialog.append(modalContent)
    modalContainer.append(modalDialog)

    return modalContainer
}

const construirFormAlterarQuantidade = (valor, idSolicitacao, idProduto) => {
    const form = criarTag('form', {name: "alterarQuantidadeItem", 'data-form-id':`alterar_${idProduto}`})
    const inputIdSolicitacao = criarTag('input', {type:'hidden', name:"idSolicitacao", id:`solicitacao_${idSolicitacao}`, value:idSolicitacao})
    const inputIdProduto = criarTag('input', {type:'hidden', name:"idProduto", id:`produto_${idProduto}`, value:idProduto})
    const popover = criarTag('span', {class:"d-inline-block", tabindex:"0", 'data-bs-toggle':"popover", 'data-bs-trigger':"hover focus", 'data-bs-content':"Alterar quantidade."}) 
    const button = criarTag('button', {type:"submit", class:"btn btn-outline-warning", name:"btnSubmit"})
    const input = criarTag('input', {type:'number', name:'quantidade', min: 1, value: valor, class:'form-control pequeno'})
    const div = criarTag('div', {class:"btn-group me-2"})
    const tagI = criarTag('i', {class: "fa fa-retweet"})
    
    form.append(inputIdSolicitacao, inputIdProduto)
    button.appendChild(tagI)
    popover.appendChild(button)
    div.appendChild(input)
    div.appendChild(popover)
    form.appendChild(div)

    return form
}

const construirFormNegarItem = (idSolicitacao, idProduto, statusSolicitacaoProduto) => {
    const form = criarTag('form', {name:'negarItem', 'data-form-id':`negar_${idProduto}`})
    const inputIdSolicitacao = criarTag('input', {type:'hidden', name:"negarProdutoSolicitacao", id:`solicitacao_${idSolicitacao}`, value:idSolicitacao})
    const inputIdProduto = criarTag('input', {type:'hidden', name:"negarProduto", id:`produto_${idProduto}`, value:idProduto})
    if(statusSolicitacaoProduto != 2 ){
        const button = criarTag('button', {class:"btn btn-outline-danger"})
        const tagI = criarTag('i', {class:"fa fa-ban"})
        button.append(tagI)
        form.append(inputIdSolicitacao, inputIdProduto, button)
    }else{
        const info = criarTag('span', {class:"btn btn-info"}, 'Negado')
        form.append(inputIdSolicitacao, inputIdProduto, info)
    }
        
    return form
}

const construirFormNegarTudo = (idSolicitacao) => {
    const form = criarTag('form', {name:'negarTudo'})
    const inputIdSolicitacao = criarTag('input', {type:'hidden', name:"negarTodaSolicitacao", id:`solicitacao_${idSolicitacao}`, value:idSolicitacao})
    const button = criarTag('button', {type: "submit", class:"btn btn-outline-danger"}, "Negar solicitação")

    form.append(inputIdSolicitacao)
    form.appendChild(button)
    return form
}

const construirFormAceitarSolicitacao = (id) => {
    const form = criarTag('form', {name:'aceitarSolicitacao', 'data-form-id':`aceitarSolicitacao_${id}`})
    const inputId = criarTag('input', {type:'hidden', name:"aceitarSolicitacao", id:`produto_${id}`, value:id})
    const button = criarTag("button", {class: "btn btn-success"}, "Aceitar Solicitação")
    
    form.append(inputId,button)
    return form
}

const criarTag = (tag, atributos={}, texto = '') => {
    const element = document.createElement(`${tag}`)
    Object.keys(atributos).forEach(atributo => {element.setAttribute(atributo, atributos[atributo])})
    if(texto) element.textContent=texto
    return element
}