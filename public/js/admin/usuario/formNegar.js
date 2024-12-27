import { criarTag } from "../../funcoes.js";

export function construirModalNegarUsuario(id, nome) {
    const modalContainer = criarTag("div", {
        class: "modal fade",
        id: `negar_${id}`,
        tabindex: "-1",
        "aria-labelledby": `negar_${id}Label`,
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
        id: "modalNegarUsuarioLabel"
    }, `Você está prestes a Negar a solicitação de ${nome}.`);

    const buttonClose = criarTag("button", {
        class: "btn-close",
        "data-bs-dismiss": "modal",
        "aria-label": "Fechar"
    });

    const modalBody = criarTag("div", {
        class: "modal-body"
    }, "Ao proceder com esta ação, a solicitação de criação de conta do usuário será negada e removida de forma permanente da lista de usuários do sistema. Esta operação é irreversível e, ao confirmá-la, você assume total responsabilidade por sua execução e seus efeitos.");

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
        name: `checkNegar${id}`,
        id: `checkNegar${id}`,
    });
    inputCheck.addEventListener('change', () => aceitarTermo(id));
    const labelCheck = criarTag("label", {
        class: "form-check-label",
        for: `checkNegar${id}`
    }, "Concordo em negar a solicitação.");

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
    }, "Não, não quero negar.");

    btnGroup1.append(btnNaoRemover);

    const btnGroup2 = criarTag("div", {
        class: "btn-group",
        role: "group"
    });

    const form = criarTag('form', {
        name:"negar",
        action: '/admin/usuarios/negar',
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

    const btnSimNegar = criarTag("button", {
        class: "btn btn-danger btn-lg disabled",
        name: `negar`,
        id: `btnNegar_${id}`
    }, "Sim, quero negar.");

    form.append(inputId, btnSimNegar)

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
    const checkbox = document.getElementById(`checkNegar${id}`);
    const btnNegar = document.getElementById(`btnNegar_${id}`);
    // Verifica se o checkbox e o botão existem antes de continuar
    if (checkbox && btnNegar) {
        // Verifica se o checkbox está selecionado e habilita/desabilita o botão
        if (checkbox.checked) {
            btnNegar.classList.remove('disabled');
        } else {
            btnNegar.classList.add('disabled');
        }
    } else {
        console.error(`Checkbox ou botão não encontrados para o ID: ${id}`);
    }
}

