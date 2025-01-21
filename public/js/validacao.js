// Função para alternar o estado do botão "Salvar"
const toggleBtnSalvar = (enable) => {
    const btnSalvar = document.querySelector('[type="submit"]');
    btnSalvar.classList.toggle('btn-primary', enable);
    btnSalvar.classList.toggle('btn-secondary', !enable);
    btnSalvar.disabled = !enable;
};

// Função para definir o estado visual de um campo
const bordaStatus = (field, valid) => {
    field.className = `form-control ${valid ? 'border-success' : 'border-danger'}`;
};

// Função genérica para validar senha
const validarCampoSenha = (field, relatedField = null) => {
    const passwords = {
        senha1: document.getElementById('novaSenha'),
        senha2: document.getElementById('novaSenhaRedigitada'),
        senhaAtual: document.getElementById('senhaAtual'),
    };

    // Valida o campo atual
    const isValid = validarSenha(field.value) && (!relatedField || field.value === relatedField.value);
    bordaStatus(field, isValid);

    // Valida todos os campos de senha
    const allValid = Object.entries(passwords).every(([key, input]) => {
        if (!input) return true; // Ignora campos ausentes
        if (key === 'senha2') return input.value === passwords.senha1?.value && validarSenha(input.value);
        return validarSenha(input.value);
    });

    // Atualiza o botão de salvar
    toggleBtnSalvar(allValid);
};

// Função para validar senha usando regex
const validarSenha = (senha) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
    return regex.test(senha);
};
