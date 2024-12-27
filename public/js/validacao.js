const btnSalvar = document.querySelector('[type="submit"]');
const senha1 = document.getElementById('novaSenha');
const senha2 = document.getElementById('novaSenha2');
const senhaAtual = document.getElementById('senhaAtual');

const toggleBtnSalvar = (enable) => {
    if (enable) {
        btnSalvar.classList.remove('btn-secondary');
        btnSalvar.classList.add('btn-primary');
        btnSalvar.removeAttribute('disabled');
    } else {
        btnSalvar.classList.remove('btn-primary');
        btnSalvar.classList.add('btn-secondary');
        btnSalvar.setAttribute('disabled', '');
    }
}

const setFieldStatus = (field, valid) => {
    if (valid) {
        field.setAttribute('class', 'form-control border-success');
    } else {
        field.setAttribute('class', 'form-control border-danger');
    }
}

const handleCPFValidation = () => {
    const isValid = validaCPF(cpf.value);
    setFieldStatus(cpf, isValid);
    toggleBtnSalvar(isValid);
}

const handleSenhaValidation = (field, relatedField = null) => {
    const isValid = validaSenha(field.value) && (!relatedField || field.value === relatedField.value);
    setFieldStatus(field, isValid);
    toggleBtnSalvar(isValid);
}


if (senha1) {
    senha1.addEventListener("input", () => handleSenhaValidation(senha1));
}

if (senhaAtual) {
    senhaAtual.addEventListener("input", () => handleSenhaValidation(senhaAtual));
}

if (senha2) {
    senha2.addEventListener("input", () => handleSenhaValidation(senha2, senha1));
}

function validaSenha(senha) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
    return regex.test(senha);
}
