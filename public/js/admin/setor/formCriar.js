import {criarTag} from "../../funcoes.js"
const popupErro = document.getElementById("popupErro")

export function construirModalCadastrarSetor (){
    const modal = criarTag('div', { class: 'modal fade', id: 'modalCadastrarSetor', tabindex: '-1', 'aria-labelledby': 'modalCadastrarSetorLabel', 'aria-hidden': 'true' });
    const modalDialog = criarTag('div', { class: 'modal-dialog' });
    const modalContent = criarTag('div', { class: 'modal-content' });

    const modalHeader = criarTag('div', { class: 'modal-header' });
    const modalTitle = criarTag('h5', { class: 'modal-title', id: 'modalCadastrarSetorLabel' }, 'Cadastrar Setor');
    const btnClose = criarTag('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Fechar' });

    modalHeader.append(modalTitle, btnClose);

    const modalBody = criarTag('div', { class: 'modal-body' });
    const form = criarTag('form', { action: '/admin/setor/criar', name:"criar" });

    const divNomeSetor = criarTag('div', { class: 'mb-3' });
    const labelNomeSetor = criarTag('label', { for: 'nomeSetor', class: 'form-label' }, 'Nome do Setor:');
    const inputNomeSetor = criarTag('input', { type: 'text', name: 'nomeSetor', id: 'nomeSetor', class: 'form-control', placeholder: 'Ex: Equipe de Gestão Corporativa', required: true, 'aria-describedby': 'nomeSetorHelp' });
    const smallNomeSetor = criarTag('small', { id: 'nomeSetorHelp', class: 'form-text text-muted' }, 'Digite o nome completo do setor.');

    divNomeSetor.append(labelNomeSetor, inputNomeSetor, smallNomeSetor);

    const divSigla = criarTag('div', { class: 'mb-3' });
    const labelSigla = criarTag('label', { for: 'sigla', class: 'form-label' }, 'Sigla:');
    const inputSigla = criarTag('input', { type: 'text', name: 'sigla', id: 'sigla', class: 'form-control', placeholder: 'Ex: EGC', required: true, 'aria-describedby': 'siglaHelp' });
    const smallSigla = criarTag('small', { id: 'siglaHelp', class: 'form-text text-muted' }, 'Digite a sigla do setor.');

    divSigla.append(labelSigla, inputSigla, smallSigla);

    const divDescricao = criarTag('div', { class: 'mb-3' });
    const labelDescricao = criarTag('label', { for: 'descricao', class: 'form-label' }, 'Descrição:');
    const textareaDescricao = criarTag('textarea', { name: 'descricao', id: 'descricao', rows: 5, class: 'form-control', placeholder: 'Uma breve descrição do setor.', required: true, 'aria-describedby': 'descricaoHelp' });
    const smallDescricao = criarTag('small', { id: 'descricaoHelp', class: 'form-text text-muted' }, 'Forneça uma descrição das responsabilidades e funções do setor.');

    divDescricao.append(labelDescricao, textareaDescricao, smallDescricao);

    const divButtons = criarTag('div', { class: 'd-flex justify-content-end mt-4' });
    const buttonSubmit = criarTag('button', { type: 'submit', class: 'btn btn-info me-2' }, 'Salvar');
    const buttonVoltar = criarTag('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Voltar');

    divButtons.append(buttonSubmit, buttonVoltar);

    form.append(divNomeSetor, divSigla, divDescricao, divButtons);
    modalBody.appendChild(form);

    modalContent.append(modalHeader, modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;
};
