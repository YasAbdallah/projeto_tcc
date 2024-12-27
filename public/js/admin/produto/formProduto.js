import {handleFormSubmit} from "./controle.js"
import {popup, criarTag} from "../../funcoes.js"
import {construirModalAlterarProduto} from "./formAlterar.js"
import {construirPaginacao, transicaoLinkPaginacao} from "../../paginacao.js"
import { construirModalRemoverProduto } from "./formRemover.js"

const popupErro = document.getElementById("popupErro")
const paginacao = document.getElementsByClassName("paginacao")[0]

window.onload = async () => {
    try{
        await contruirSection()
        await handleFormSubmit('alterar', '/admin/produto/alterar')
        await handleFormSubmit('remover', '/admin/produto/remover')
        await handleFormSubmit('add', '/admin/produto/add')
    }catch(err){
        await popup(popupErro, {sucesso:false, message: `Ocorreu um erro ao recuperar dados dos produtos.`})
    }
}


const contruirSection = async () => {
    const sectionProduto = document.getElementById("listaProduto");
    let listaProduto = ''
    if (window.location.href.includes("search")){
        listaProduto = await fetch(`/admin/produto/search${window.location.search}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }else{
        listaProduto = await fetch(`/admin/produto${window.location.search}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    
    if (listaProduto.ok) {
        try {
            const result = await listaProduto.json();
            result.produtos.forEach(async produto => {
                sectionProduto.append(construirTableProduto(produto), trImagemCodigoBarra(produto), construirModalAlterarProduto(produto), construirModalRemoverProduto(produto._id, produto.produto))
            });
            const linkPaginas = await construirPaginacao(result.paginas)
            paginacao.append(linkPaginas)
            await transicaoLinkPaginacao()
        } catch (err) {
            console.error(err);
            popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao processar os dados dos usuários." });
        }
    } else {
        popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao recuperar as listas de solicitações" });
    }
};

const construirTableProduto = (dados ={}) => {
    const { _id, codigo, produto, descricao, observacao, saldo } = dados;

    // Linha de Produto
    const trProduto = criarTag('tr');

    const tdBotaoColapsar = criarTag('td');
    const btnColapsar = criarTag('button', { class: 'btn', 'data-bs-toggle': 'collapse', href: `#collapse${_id}`, role: 'button', 'aria-expanded': 'false', 'aria-controls': `collapse${_id}` });
    const iconColapsar = criarTag('i', { class: 'fa-solid fa-caret-down' });
    btnColapsar.appendChild(iconColapsar);
    tdBotaoColapsar.appendChild(btnColapsar);
    trProduto.appendChild(tdBotaoColapsar);

    const tdCodigo = criarTag('td', {}, codigo);
    const tdProduto = criarTag('td', {}, produto);
    const tdDescricao = criarTag('td', {}, descricao);
    const tdObservacao = criarTag('td', {}, observacao);
    const tdSaldo = criarTag('td', {}, saldo);

    trProduto.append(tdCodigo, tdProduto, tdDescricao, tdObservacao, tdSaldo);

    const tdAcoes = criarTag('td');
    const divBtnGroup = criarTag('div', { class: 'btn-group me-2' });

    // Botão Alterar
    const btnAlterar = criarTag('button', { class: 'btn btn-warning', name: 'alterar', 'data-bs-toggle': 'modal', 'data-bs-target': `#modalAlterar${_id}`, 'aria-label': 'Alterar produto' });
    const iconAlterar = criarTag('i', { class: 'fa-solid fa-rotate' });
    btnAlterar.appendChild(iconAlterar);
    divBtnGroup.appendChild(btnAlterar);

    // Botão Remover
    const btnRemover = criarTag('button', { class: 'btn btn-danger', name: 'remover', 'data-bs-toggle': 'modal', 'data-bs-target': `#modalRemover${_id}`, 'aria-label': 'Remover produto' });
    const iconRemover = criarTag('i', { class: 'fa-regular fa-trash-can' });
    btnRemover.appendChild(iconRemover);
    divBtnGroup.appendChild(btnRemover);

    tdAcoes.appendChild(divBtnGroup);
    trProduto.appendChild(tdAcoes);

    // Linha de Detalhes Colapsados

    return trProduto;
    
}

const trImagemCodigoBarra = (dados = {}) => {
    const { _id, codigo, produto, descricao, observacao, saldo } = dados;
    const trDetalhes = criarTag('tr', { class: 'collapse', id: `collapse${_id}` });
    const tdDetalhes = criarTag('td', { colspan: '6', name: 'codigoBarra' });

    const imgCodigoBarra = criarTag('img', { class: 'img-thumbnail', alt: produto, 'data-info-img': codigo});
    JsBarcode(imgCodigoBarra, imgCodigoBarra.getAttribute("data-info-img"), {
        text: imgCodigoBarra.alt,
        width: 5,
        heigth: 50,
        fontSize: 15
    })

    const linkDownload = criarTag('a', { class: 'btn btn-danger m-5', download: `codigo-barras-${codigo}`, 'aria-label': 'Baixar código de barras', href: imgCodigoBarra.src});
    const iconDownload = criarTag('i', { class: 'fa-solid fa-download' });
    linkDownload.append(iconDownload, ' Fazer Download');
    tdDetalhes.appendChild(linkDownload);

    tdDetalhes.appendChild(imgCodigoBarra);

    trDetalhes.appendChild(tdDetalhes);

    return trDetalhes
}