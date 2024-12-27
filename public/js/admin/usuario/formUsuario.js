import {popup, criarTag} from "../../funcoes.js"
import {handleFormSubmit} from "./controle.js"
import {construirModalAlterar} from "./formAlterar.js"
import {construirModalRemoverUsuario} from "./formRemover.js"
import {construirModalAprovarUsuario} from "./formAprovar.js"
import {construirModalNegarUsuario} from "./formNegar.js"

const popupErro = document.getElementById("popupErro")

window.onload = async () => {
    try{
        await contruirSection()
        // Funções específicas que usam a função genérica
        handleFormSubmit('negar', '/admin/usuarios/negar')
        handleFormSubmit('alterar', '/admin/usuarios/alterar')
        handleFormSubmit('remover', '/admin/usuarios/remover')
        handleFormSubmit('aprovar', '/admin/usuarios/aprovar')
    }catch(err){
        popup(popupErro, {sucesso:false, message: `Ocorreu um erro ao recuperar dados dos usuários.`})
    }
}

const contruirSection = async () => {
    const sectionUsuarios = document.getElementById("listaUsuarios");
    const listaUsuarios = await fetch('/admin/usuarios', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (listaUsuarios.ok) {
        try {
            const result = await listaUsuarios.json();
            result.usuarios.forEach(usuario => {
                const dados = {
                    id: usuario._id,
                    nome: usuario.nome,
                    sobrenome: usuario.sobrenome,
                    cpf: usuario.cpf,
                    nomeSetor: usuario.secao.nomeSetor,
                    siglaSetor: usuario.secao.sigla,
                    solicitacao: usuario.solicitacao,
                    tipoUsuario: usuario.tipoUsuario,
                    aprovado: usuario.aprovado
                };
                if (usuario.aprovado === 1 && usuario.visibilidade === 1) {
                    sectionUsuarios.append(construirCard(dados), construirModalAlterar(dados, result.setores), construirModalRemoverUsuario(dados.id, dados.nome));
                }
                if(usuario.aprovado === 0 && usuario.visibilidade === 1){
                    sectionUsuarios.append(construirCardAprovar(dados), construirModalAprovarUsuario(dados, result.setores), construirModalNegarUsuario(dados.id, dados.nome));
                }
            });
        } catch (err) {
            console.error(err);
            popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao processar os dados dos usuários." });
        }
    } else {
        popup(popupErro, { sucesso: false, message: "Ocorreu um erro ao recuperar as listas de solicitações" });
    }
};

const construirCard = (dados = {}) => {
    const { id, nome, sobrenome, nomeSetor, siglaSetor, solicitacao, tipoUsuario, aprovado, visibilidade } = dados;
    const tagIAprovado = criarTag('i', { class: `fa ${aprovado === 1 ? "fa-check" : "fa-times"}`, "aria-hidden": "true" });

    const txtSpanSolicitacao = solicitacao === 0 
        ? " Cadastro solicitado pelo usuário." 
        : " Esta conta foi criada pelo administrador.";

    const spanSolicitacao = criarTag("span", { name: "solicitacao" }, txtSpanSolicitacao);

    const card = criarTag('section', { class: 'card card-lista-usuarios border border-success m-3' });
    const body = criarTag('section', { class: "card-body" });

    const tituloCard = criarTag('h5', { class: 'card-title text-start fw-bold' }, `${nome} ${sobrenome}`);
    const subTituloCard = criarTag('h6', { class: 'card-subtitle m-2 text-body-secondary link-underline-info' }, `${nomeSetor} - ${siglaSetor}`);
    tituloCard.append(subTituloCard, document.createElement('hr'));

    const p = criarTag('p', { class: "card-text" }, `Tipo de usuário: ${tipoUsuario === 0 ? " Usuário Comum " : " Administrador "}`);
    const span = criarTag('span', { name: "aprovado", "data-bs-toggle": "tooltip", "title": "Status de aprovação" });
    span.append(tagIAprovado);
    p.append(span);

    const informacaoAdicional = criarTag("p", { class: "card-text" }, `Informações Adicionais:`);
    informacaoAdicional.append(spanSolicitacao);

    const buttonAlterar = criarTag("button", { class: "btn btn-link", name: 'btnAlterar', "data-bs-toggle": "modal", "data-bs-target": `#alterar_${id}` }, "Alterar");
    const buttonRemover = criarTag("button", { class: "btn btn-link", name: "remover", "data-bs-toggle": "modal", "data-bs-target": `#remover_${id}` }, "Remover");

    body.append(tituloCard, p, informacaoAdicional, buttonAlterar, buttonRemover);
    card.appendChild(body);

    return card;
}

const construirCardAprovar = (dados = {}) => {
    const { id, nome, sobrenome, nomeSetor, siglaSetor, solicitacao, tipoUsuario } = dados;
    const tagIAprovado = criarTag('i', { class: "fa fa-times", "aria-hidden": "true" });

    const txtSpanSolicitacao = solicitacao === 0 
        ? " Cadastro solicitado pelo usuário." 
        : " Esta conta foi criada pelo administrador.";

    const spanSolicitacao = criarTag("span", { name: "solicitacao" }, txtSpanSolicitacao);

    const card = criarTag('section', { class: 'card card-lista-usuarios border border-warning m-3' });
    const body = criarTag('section', { class: "card-body" });

    const tituloCard = criarTag('h5', { class: 'card-title text-start fw-bold' }, `${nome} ${sobrenome}`);
    const subTituloCard = criarTag('h6', { class: 'card-subtitle m-2 text-body-secondary link-underline-info' }, `${nomeSetor} - ${siglaSetor}`);
    tituloCard.append(subTituloCard, document.createElement('hr'));

    const p = criarTag('p', { class: "card-text" }, `Tipo de usuário: ${tipoUsuario === 0 ? " Usuário Comum " : " Administrador "}`);
    const span = criarTag('span', { name: "aprovado", "data-bs-toggle": "tooltip", "title": "Status de aprovação" });
    span.append(tagIAprovado);
    p.append(span);

    const informacaoAdicional = criarTag("p", { class: "card-text" }, `Informações Adicionais:`);
    informacaoAdicional.append(spanSolicitacao);

    const buttonAprovar = criarTag("button", { class: "btn btn-link", name: 'btnAprovar', "data-bs-toggle": "modal", "data-bs-target": `#aprovar_${id}` }, "Aprovar solicitação");
    const buttonNegar = criarTag("button", { class: "btn btn-link", name: 'btnNegar', "data-bs-toggle": "modal", "data-bs-target": `#negar_${id}` }, "Negar Solicitação");

    body.append(tituloCard, p, informacaoAdicional, buttonAprovar, buttonNegar);
    card.appendChild(body);

    return card;
}

