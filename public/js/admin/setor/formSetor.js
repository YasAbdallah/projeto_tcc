import {handleFormSubmit} from "./controle.js"
import {popup, criarTag} from "../../funcoes.js"
import {construirModalAlterarSetor} from "./formAlterar.js"
import {construirModalRemoverSetor} from "./formRemover.js"
import {construirModalCadastrarSetor} from "./formCriar.js"

const popupErro = document.getElementById("popupErro")
const modalCadastrar = document.getElementById("modalCadastrar")
window.onload = async () => {
    try{
        await contruirSection()
        modalCadastrar.append(construirModalCadastrarSetor())
        handleFormSubmit("alterar", "/admin/setor/alterar")
        handleFormSubmit("remover", "/admin/setor/remover")
        handleFormSubmit("criar", "/admin/setor/criar")
    }catch(err){
        await popup(popupErro, {sucesso:false, message: `Ocorreu um erro ao recuperar dados dos usuários.`})
    }
}

const contruirSection = async () => {
    const sectionSetor = document.getElementById("listaSetor");
    const listaSetor = await fetch('/admin/setor', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (listaSetor.ok) {
        try {
            const result = await listaSetor.json();
            result.setor.forEach(setor => {
                const dados = {
                    id: setor._id,
                    nomeSetor: setor.nomeSetor,
                    sigla: setor.sigla,
                    descricao: setor.descricao
                }
                sectionSetor.append(construirCardSetor(dados), construirModalAlterarSetor(dados), construirModalRemoverSetor(dados.id, dados.sigla));
            });
        } catch (err) {
            console.error(err);
            popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao processar os dados dos usuários." });
        }
    } else {
        popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao recuperar as listas de solicitações" });
    }
};

const construirCardSetor = (dados = {}) => {
    const { id, nomeSetor, sigla, descricao } = dados;

    const card = criarTag('article', { class: 'col card card-lista-solicitacao ms-3 mb-3', 'aria-labelledby': `setor-${id}` });
    const header = criarTag('header', { class: 'card-body' });
    const tituloCard = criarTag('h2', { id: `setor-${id}`, class: 'card-title fs-3' }, `${nomeSetor} - ${sigla}`);
    
    header.append(tituloCard);

    const descricaoCard = criarTag('p', { class: 'card-text m-3' }, descricao);

    const footer = criarTag('footer', { class: 'mt-3' });
    const nav = criarTag('nav', { 'aria-label': 'Ações do setor' });

    const ul = criarTag('ul', { class: 'list-inline' });
    const liAlterar = criarTag('li', { class: 'list-inline-item' });
    const buttonAlterar = criarTag('button', {class: 'btn btn-link', name: 'btnAlterar', "data-bs-toggle": "modal", "data-bs-target": `#alterar_${id}`}, 'Alterar');
    
    liAlterar.append(buttonAlterar);

    const liRemover = criarTag('li', { class: 'list-inline-item' });
    const buttonRemover = criarTag('button', {class: 'btn btn-link', name: "btnRemover", "data-bs-toggle": "modal", "data-bs-target": `#remover_${id}`}, 'Remover');
    
    liRemover.append(buttonRemover);

    ul.append(liAlterar, liRemover);
    nav.append(ul);
    footer.append(nav);

    card.append(header, descricaoCard, footer);
    
    return card;
};

/**
 * Mexer na parte de criação de setores! 
 */