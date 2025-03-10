import { handleForm } from "../../enviarForm.js";
import { preencherGenero, formataDataNascimento } from "../../perfil/validacao.js";
import { validarEmail, validarTelefone } from "../../funcoes.js"

window.onload = async () => {
    await preencherGenero();
    await formataDataNascimento();
    await handleForm("formDadosConta", "/painel/funcionario/perfil/alterarDados");

    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const inputServico = document.getElementById('servico');
    const inputDia = document.getElementById('diasDisponiveis');
    const divDias = document.querySelectorAll('.servicos')[0];
    const divServicos = document.querySelectorAll('.servicos')[1];
    const spanRemoveTag = document.querySelectorAll('.remove-tag');

    spanRemoveTag.forEach(tag => { 
        tag.addEventListener('click', (event) => {
            removeTag(event.target.parentElement);
        }); 
    });

    email.addEventListener("focusout", () => {
        validarEmail(email.value) ? email.style.border = "1px solid green" : email.style.border = "1px solid red";
    });

    telefone.addEventListener("keyup", () => {
        telefone.value = validarTelefone(telefone.value);
    });

    inputServico.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const tagText = inputServico.value.trim();
            if (tagText) {
                divServicos.appendChild(addTag(".tag-container-servicos", "tag-servico", "servico", tagText));
                inputServico.value = "";
            }
        }
    });

    inputDia.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const tagText = inputDia.value.trim();
            if (tagText) {
                divDias.appendChild(addTag(".tag-container-dias", "tag-dia", "dia", tagText));
                inputDia.value = "";
            }
        }
    });

    const addTag = (containerTag, tagName, inputTagName, text) => {
        const tagContainer = document.querySelector(containerTag);
        const quantidadeDivTag = document.querySelectorAll(`[name="${tagName}"]`).length;
        const tag = document.createElement('div');
        tag.classList.add('tag');
        const inputTag = document.createElement('input');
        inputTag.setAttribute("type", "hidden");
        inputTag.setAttribute("name", `${inputTagName}-${quantidadeDivTag}`);
        inputTag.setAttribute("value", text);

        const span = document.createElement('span');
        span.textContent = text;

        const removeBtn = document.createElement('span');
        removeBtn.classList.add('remove-tag');
        removeBtn.textContent = 'x';
        removeBtn.addEventListener('click', function () {
            tag.remove();
        });

        tag.appendChild(inputTag);
        tag.appendChild(span);
        tag.appendChild(removeBtn);
        return tagContainer.appendChild(tag);
    }

    const removeTag = (tag) => {
        tag.remove();
    }
};