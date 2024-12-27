import { criarTag } from "../../funcoes.js";

export function construirModalAlterarProduto(dados = {}) {
    const { _id, codigo, produto, saldo, descricao, observacao } = dados;

    const modal = criarTag('div', { class: 'modal fade', id: `modalAlterar${_id}`, tabindex: '-1', 'aria-labelledby': 'modalAlterarLabel', 'aria-hidden': 'true' });
    const modalDialog = criarTag('div', { class: 'modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable' });
    const modalContent = criarTag('div', { class: 'modal-content' });

    const modalHeader = criarTag('div', { class: 'modal-header' });
    const modalTitle = criarTag('h5', { class: 'modal-title', id: 'modalAlterarLabel' }, 'Alterar Produto');
    const btnClose = criarTag('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Fechar' });

    modalHeader.append(modalTitle, btnClose);

    const modalBody = criarTag('div', { class: 'modal-body' });
    const form = criarTag('form', { name: 'alterar', 'data-form-id': `alterar_${_id}`, class: 'd-flex flex-column' });
    const inputId = criarTag('input', { type: 'hidden', name: 'id', id: 'id', value: _id });

    const divCodigo = criarTag('div', { class: 'mb-3' });
    const labelCodigo = criarTag('label', { for: 'codigo', class: 'col-form-label' }, 'Código do Produto:');
    const inputCodigo = criarTag('input', { type: 'text', name: 'codigo', id: 'codigo', class: 'form-control', value: codigo, required: true });
    divCodigo.append(labelCodigo, inputCodigo);

    const divProduto = criarTag('div', { class: 'mb-3 row' });
    const divColProduto = criarTag('div', { class: 'col-md-8' });
    const labelProduto = criarTag('label', { for: 'produto', class: 'col-form-label' }, 'Produto:');
    const inputProduto = criarTag('input', { type: 'text', name: 'produto', id: 'produto', class: 'form-control', value: produto, placeholder: 'Nome do produto.', required: true });

    const divColSaldo = criarTag('div', { class: 'col-md-4' });
    const labelSaldo = criarTag('label', { for: 'saldo', class: 'col-form-label' }, 'Saldo:');
    const inputSaldo = criarTag('input', { type: 'number', name: 'saldo', id: 'saldo', class: 'form-control', value: saldo });

    divColProduto.append(labelProduto, inputProduto);
    divColSaldo.append(labelSaldo, inputSaldo);
    divProduto.append(divColProduto, divColSaldo);

    const divDescricao = criarTag('div', { class: 'mb-3' });
    const labelDescricao = criarTag('label', { for: 'descricao', class: 'col-form-label' }, 'Descrição:');
    const textareaDescricao = criarTag('textarea', { name: 'descricao', id: 'descricao', rows: 5, class: 'form-control', placeholder: 'Uma breve descrição do Produto.', required: true }, descricao);
    divDescricao.append(labelDescricao, textareaDescricao);

    const divObservacao = criarTag('div', { class: 'mb-3' });
    const labelObservacao = criarTag('label', { for: 'observacao', class: 'col-form-label' }, 'Observações:');
    const textareaObservacao = criarTag('textarea', { name: 'observacao', id: 'observacao', rows: 5, class: 'form-control', placeholder: 'Observações extras sobre o Produto.' }, observacao);
    divObservacao.append(labelObservacao, textareaObservacao);

    const divButtons = criarTag('div', { class: 'd-flex justify-content-end' });
    const buttonSubmit = criarTag('button', { type: 'submit', class: 'btn btn-info me-2' }, 'Alterar');
    const buttonClose = criarTag('button', { type: 'button', class: 'btn btn-secondary', 'data-bs-dismiss': 'modal' }, 'Sair');
    divButtons.append(buttonSubmit, buttonClose);

    form.append(inputId, divCodigo, divProduto, divDescricao, divObservacao, divButtons);
    modalBody.appendChild(form);

    modalContent.append(modalHeader, modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;
};