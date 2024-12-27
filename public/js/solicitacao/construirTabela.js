import { criarTag } from "../funcoes.js"

export function contruirTabela(produto, id){
    const tbodyCarrinho = document.getElementById("tbodyCarrinho")
    const tr = document.createElement('tr')
    delete produto.observacao
    Object.keys(produto).forEach( (itens) =>{
        const td = document.createElement('td')
        if(itens == "_id") td.hidden = true
        if(itens == "quantidade"){
            td.appendChild(construirFormAlterarQuantidade(produto.quantidade, id))
        }else{
            td.textContent = produto[itens]
        }
        tr.appendChild(td)
    })
    const td = document.createElement('td')
    td.appendChild(construirFormRemoverItem(id))
    tr.appendChild(td)
    tbodyCarrinho.appendChild(tr)
}

const construirFormAlterarQuantidade = (valor, id) => {
    const form = criarTag('form', {name: "alterarQuantidadeItem", 'data-form-id':`alterar_${id}`})
    const inputId = criarTag('input', {type:'hidden', name:"alterarProduto", id:`produto_${id}`, value:id})
    const button = criarTag('button', {type:"submit", class:"btn btn-outline-warning", name:"btnSubmit"})
    const input = criarTag('input', {type:'number', name:'quantidade', min: 1, value: valor, class:'form-control'})
    const div = criarTag('div', {class:"btn-group me-2"})
    const tagI = criarTag('i', {class: "fa fa-retweet"})
    
    form.appendChild(inputId)
    button.appendChild(tagI)
    div.appendChild(input)
    div.appendChild(button)
    form.appendChild(div)

    return form
}

const construirFormRemoverItem = (id) => {
    const form = criarTag('form', {name:'removerItem', 'data-form-id':`remover_${id}`})
    const inputId = criarTag('input', {type:'hidden', name:"removerProduto", id:`produto_${id}`, value:id})
    const button = criarTag('button', {type: "submit", class:"btn btn-outline-danger"})
    const tagI = criarTag('i', {class:"fa fa-trash"})

    button.appendChild(tagI)
    form.appendChild(inputId)
    form.appendChild(button)
    return form
}
