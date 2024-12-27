import { criarTag } from "../../funcoes.js";

export function construirModalRemoverSetor(id, sigla) {
    const modalContainer = criarTag("div", {
        class: "modal fade",
        id: `remover_${id}`,
        tabindex: "-1",
        "aria-labelledby": `remover_${id}Label`,
        "aria-hidden": "true"
    });

    const modalDialog = criarTag("div", {
        class: "modal-dialog modal-dialog-centered"
    });

    const modalContent = criarTag("div", {
        class: "modal-content"
    });

    const modalHeader = criarTag("div", {
        class: "modal-header"
    });

    const modalTitle = criarTag("h1", {
        class: "modal-title fs-5",
        id: "modalRemoverUsuarioLabel"
    }, `Você está prestes a remover o setor ${sigla} da lista`);

    const buttonClose = criarTag("button", {
        class: "btn-close",
        "data-bs-dismiss": "modal",
        "aria-label": "Fechar"
    });

    const modalBody = criarTag("div", {
        class: "modal-body"
    }, "Ao proceder com esta ação, o setor será removido de forma permanente da lista de setores do sistema. Esta operação é irreversível e, ao confirmá-la, você assume total responsabilidade por sua execução e seus efeitos.");

    const modalFooter = criarTag("div", {
        class: "modal-footer"
    });

    const formCheck = criarTag("div", {
        class: "form-check fs-6"
    });

    const inputCheck = criarTag("input", {
        class: "form-check-input",
        type: "checkbox",
        value: "",
        name: `checkRemover${id}`,
        id: `checkRemover${id}`,
    });
    inputCheck.addEventListener('change', () => aceitarTermo(id));
    const labelCheck = criarTag("label", {
        class: "form-check-label",
        for: `checkRemover${id}`
    }, "Concordo em remover o setor.");

    formCheck.append(inputCheck, labelCheck);

    const btnToolbar = criarTag("div", {
        class: "btn-toolbar justify-content-between mb-3",
        role: "toolbar",
        "aria-label": "Toolbar com grupos de botões"
    });

    const btnGroup1 = criarTag("div", {
        class: "btn-group",
        role: "group"
    });

    const btnNaoRemover = criarTag("button", {
        class: "btn btn-secondary btn-lg",
        "data-bs-dismiss": "modal"
    }, "Não, não quero remover.");

    btnGroup1.append(btnNaoRemover);

    const btnGroup2 = criarTag("div", {
        class: "btn-group",
        role: "group"
    });

    const form = criarTag('form', {
        name:"remover",
        action: '/admin/setor/remover',
        method: 'POST',
        class: 'd-flex flex-column justify-content-center',
        'aria-labelledby': 'aprovarUsuarioModalLabel'
    });

    const inputId = criarTag('input', {
        type: 'hidden',
        name: 'id',
        id: 'id',
        value: id
    });

    const btnSimRemover = criarTag("button", {
        class: "btn btn-danger btn-lg disabled",
        name: `remover`,
        id: `btnRemover_${id}`
    }, "Sim, quero remover.");

    form.append(inputId, btnSimRemover)

    btnGroup2.append(form);

    btnToolbar.append(btnGroup1, btnGroup2);

    modalFooter.append(formCheck, btnToolbar);
    modalHeader.append(modalTitle, buttonClose);
    modalContent.append(modalHeader, modalBody, modalFooter);
    modalDialog.append(modalContent);
    modalContainer.append(modalDialog);

    return modalContainer;
};

function aceitarTermo(id) {
    const checkbox = document.getElementById(`checkRemover${id}`);
    const btnRemover = document.getElementById(`btnRemover_${id}`);
    // Verifica se o checkbox e o botão existem antes de continuar
    if (checkbox && btnRemover) {
        // Verifica se o checkbox está selecionado e habilita/desabilita o botão
        if (checkbox.checked) {
            btnRemover.classList.remove('disabled');
        } else {
            btnRemover.classList.add('disabled');
        }
    } else {
        console.error(`Checkbox ou botão não encontrados para o ID: ${id}`);
    }
}

