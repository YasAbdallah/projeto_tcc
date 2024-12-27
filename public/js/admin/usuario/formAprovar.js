import { criarTag, criarDiv } from "../../funcoes.js";

function construirModalAprovarUsuario(dados = {}, setores = {}) {
    // Criar o modal
    const modal = criarTag('div', { class: 'modal fade', id: `aprovar_${dados.id}`, tabindex: '-1', 'aria-labelledby': `aprovar_${dados.id}Label`, 'aria-hidden': 'true' });
    const modalDialog = criarTag('div', { class: 'modal-dialog modal-lg' });
    const modalContent = criarTag('div', { class: 'modal-content' });

    // Criar o cabeçalho do modal
    const modalHeader = criarTag('div', { class: 'modal-header' });
    const modalTitle = criarTag('h1', { class: 'modal-title fs-5', id: 'aprovarUsuarioModalLabel' }, `Aprovar: ${dados.nome}`);
    const modalCloseButton = criarTag('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' });
    modalHeader.append(modalTitle, modalCloseButton);

    // Criar o corpo do modal
    const modalBody = criarTag('div', { class: 'modal-body' });

    // Criar o formulário
    const form = criarTag('form', { action: '/admin/usuarios/aprovar', method: 'POST', class: 'd-flex flex-column justify-content-center', 'aria-labelledby': 'aprovarUsuarioModalLabel' });
    const inputId = criarTag('input', { type: 'hidden', name: 'id', id: 'id', value: dados.id });

    // Função para criar um grupo de label e input
    function criarGrupo(labelText, inputType, inputName, inputValue, inputId, additionalAttributes = {}) {
        const div = criarTag('div', { class: 'mb-3' });
        const label = criarTag('label', { for: inputId, class: 'col-form-label' }, labelText);
        const input = criarTag('input', { type: inputType, name: inputName, id: inputId, value: inputValue, class: 'form-control', ...additionalAttributes });
        div.append(label, input);
        return div;
    }

    // Criar os grupos de campos
    const divNome = criarGrupo('Nome do usuário:', 'text', 'nomeUsuario', dados.nome, 'nomeUsuario', { required: true });
    const divSobrenome = criarGrupo('Sobrenome do usuário:', 'text', 'sobrenome', dados.sobrenome, 'sobrenome', { required: true });
    const divCPF = criarGrupo('CPF do usuário:', 'text', 'cpf', dados.cpf, 'cpf', { maxlength: 11, required: true });

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
    const divTipoUsuario = criarTag('div', { class: 'mb-3' });
    const labelTipoUsuario = criarTag('label', { for: 'tipoUsuario', class: 'col-form-label' }, 'Tipo do usuário:');
    const selectTipoUsuario = criarTag('select', { name: 'tipoUsuario', id: 'tipoUsuario', class: 'form-control', required: true });
    const optionTipoUsuario1 = criarTag('option', { value: 0 }, '1 - Usuário comum.');
    const optionTipoUsuario2 = criarTag('option', { value: 1 }, '2 - Administrador.');
    selectTipoUsuario.append(optionTipoUsuario1, optionTipoUsuario2);
    divTipoUsuario.append(labelTipoUsuario, selectTipoUsuario);

    // Botão de submissão e voltar
    const buttonAprovar = criarTag('button', { class: 'btn btn-info' }, 'Aprovar');

    // Montar o formulário e adicionar ao modal body
    form.append(inputId, divNome, divSobrenome, divCPF, divSetor, divTipoUsuario, buttonAprovar);
    modalBody.append(form);

    // Montar o conteúdo do modal
    modalContent.append(modalHeader, modalBody);
    modalDialog.append(modalContent);
    modal.append(modalDialog);

    return modal;
}

export{
    construirModalAprovarUsuario
}