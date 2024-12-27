import {criarTag} from "../../funcoes.js"

export function construirModalAlterarSetor (dados = {}) {
    const { id, nomeSetor, sigla, descricao } = dados;

    const modal = criarTag('div', { class: 'modal fade', id: `alterar_${id}`, tabindex: '-1', 'aria-labelledby': `modalAlterarSetor_${id}Label`, 'aria-hidden': 'true' });
    const modalDialog = criarTag('div', { class: 'modal-dialog' });
    const modalContent = criarTag('div', { class: 'modal-content' });

    const modalHeader = criarTag('div', { class: 'modal-header' });
    const modalTitle = criarTag('h5', { class: 'modal-title', id: 'modalAlterarSetorLabel' }, `Alterar Setor: ${sigla}`);
    const btnClose = criarTag('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Fechar' });

    modalHeader.append(modalTitle, btnClose);

    const modalBody = criarTag('div', { class: 'modal-body' });
    const form = criarTag('form', { name: 'alterar', 'data-form-id': `alterar_${id}`, class: 'd-flex flex-column justify-content-center' });
    const inputId = criarTag('input', { type: 'hidden', name: 'id', id: 'id', value: id });

    const divRow = criarTag('div', { class: 'row mb-3' });

    const divColNome = criarTag('div', { class: 'col-sm-6' });
    const labelNome = criarTag('label', { for: 'nomeSetor', class: 'col-form-label' }, 'Nome do Setor:');
    const inputNome = criarTag('input', { type: 'text', name: 'nomeSetor', id: 'nomeSetor', class: 'form-control', value: nomeSetor, required: true, 'aria-describedby': 'nomeSetorHelp' });
    const smallNome = criarTag('small', { id: 'nomeSetorHelp', class: 'form-text text-muted' }, 'Digite o nome completo do setor.');

    divColNome.append(labelNome, inputNome, smallNome);

    const divColSigla = criarTag('div', { class: 'col-sm-6' });
    const labelSigla = criarTag('label', { for: 'sigla', class: 'col-form-label' }, 'Sigla:');
    const inputSigla = criarTag('input', { type: 'text', name: 'sigla', id: 'sigla', class: 'form-control', value: sigla, required: true, 'aria-describedby': 'siglaHelp' });
    const smallSigla = criarTag('small', { id: 'siglaHelp', class: 'form-text text-muted' }, 'Digite a sigla do setor.');

    divColSigla.append(labelSigla, inputSigla, smallSigla);

    divRow.append(divColNome, divColSigla);

    const divDescricao = criarTag('div', { class: 'mb-3' });
    const labelDescricao = criarTag('label', { for: 'descricao', class: 'form-label' }, 'Descrição:');
    const textareaDescricao = criarTag('textarea', { name: 'descricao', id: 'descricao', cols: 30, rows: 5, class: 'form-control', required: true, 'aria-describedby': 'descricaoHelp' }, descricao);
    const smallDescricao = criarTag('small', { id: 'descricaoHelp', class: 'form-text text-muted' }, 'Descreva as responsabilidades ou funções do setor.');

    divDescricao.append(labelDescricao, textareaDescricao, smallDescricao);

    const buttonSubmit = criarTag('button', {class: 'btn btn-info'}, 'Salvar');

    form.append(inputId, divRow, divDescricao, buttonSubmit);
    modalBody.appendChild(form);

    modalContent.append(modalHeader, modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;
};
