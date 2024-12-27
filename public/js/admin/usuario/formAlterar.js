import {criarTag, criarDiv} from "../../funcoes.js"

export function construirModalAlterar(dados = {}, setores = {}) {
    const modalContainer = criarTag("section", {
        class: "modal fade",
        id: `alterar_${dados.id}`,
        tabindex: "-1",
        "aria-labelledby": `alterar_${dados.id}Label`,
        "aria-hidden": "true"
    });

    const modalDialog = criarTag("div", {
        class: "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    });

    const modalContent = criarTag("div", {
        class: "modal-content"
    });

    const modalHeader = criarTag("div", {
        class: "modal-header"
    });

    const title = criarTag("h1", {
        class: "modal-title fs-5",
        id: `alterar_${dados.id}Label`
    }, `Alterar dados de ${dados.nome} ${dados.sobrenome}`);

    const buttonClose = criarTag("button", {
        class: "btn-close",
        'data-bs-dismiss': "modal",
        "aria-label": "Close"
    });

    modalHeader.append(title, buttonClose);
    const form = formAlterar(dados, setores);

    const modalBody = criarTag('div', {
        class: "modal-body"
    });

    const divFooter = criarTag('div', {
        class: "modal-footer"
    });

    modalBody.append(form, divFooter);
    modalContent.append(modalHeader, modalBody);
    modalDialog.append(modalContent);
    modalContainer.append(modalDialog);

    return modalContainer;
}

function formAlterar(dados = {}, setores = {}) {
    const form = criarTag('form', { name: 'alterar', 'data-form-id': `alterar_${dados.id}`, class: 'd-flex flex-column justify-content-center' });
    const inputId = criarTag('input', { type: 'hidden', name: 'id_alterar', id: `${dados.id}`, value: dados.id });

    // Função para criar um grupo de label e input
    function criarGrupo(labelText, inputType, inputName, inputValue, inputId, additionalAttributes = {}) {
        const divRow = criarDiv();
        const label = criarTag('label', { for: inputId, class: 'col-form-label' }, labelText);
        const input = criarTag('input', { type: inputType, name: inputName, id: inputId, value: inputValue, class: 'form-control', ...additionalAttributes });
        divRow.append(label, input);
        return divRow;
    }

    // Criar os grupos de campos
    const div1 = criarGrupo('Nome do usuário:', 'text', 'nome', dados.nome, 'nome');
    const div2 = criarGrupo('Sobrenome do usuário:', 'text', 'sobrenome', dados.sobrenome, 'sobrenome');
    const div3 = criarGrupo('CPF do usuário:', 'text', 'cpf', dados.cpf, 'cpf', { maxlength: 11 });

    // Setor
    const divSetor = criarDiv();
    const labelSetor = criarTag('label', { for: 'setor', class: 'col-form-label' }, 'Setor do usuário:');
    const selectSetor = criarTag('select', { class: 'form-control', name: 'setor', id: 'setor' });
    setores.forEach((setor) => {
        const optionSetor = criarTag('option', { value:setor._id }, `${setor.nomeSetor} - ${setor.sigla}`);
        selectSetor.append(optionSetor);
    });
    divSetor.append(labelSetor, selectSetor);

    // Tipo de Usuário
    const divTipoUsuario = criarDiv();
    const labelTipoUsuario = criarTag('label', { for: 'tipousuario', class: 'col-form-label' }, 'Tipo do usuário:');
    const selectTipoUsuario = criarTag('select', { name: 'tipousuario', id: 'tipousuario', class: 'form-control' });
    const optionTipoUsuario1 = criarTag('option', { value: 0 }, '1 - Usuário comum');
    const optionTipoUsuario2 = criarTag('option', { value: 1 }, '2 - Administrador');
    selectTipoUsuario.append(optionTipoUsuario1, optionTipoUsuario2);
    divTipoUsuario.append(labelTipoUsuario, selectTipoUsuario);

    // Botão
    const buttonAlterar = criarTag('button', { class: 'btn btn-info'}, 'Alterar');

    // Montar o formulário
    form.append(inputId, div1, div2, div3, divSetor, divTipoUsuario, buttonAlterar);
    return form;
}



