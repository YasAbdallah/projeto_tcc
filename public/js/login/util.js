
function mascaraCPF(input) {
    let cpf = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length <= 11) { 
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');         // Aplica ponto após os três primeiros dígitos
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');         // Aplica ponto após os próximos três dígitos
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');   // Aplica hífen antes dos últimos dois dígitos
    }
    
    input.value = cpf;
}

function removerMascaraCPF(input) {
    return input.value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false; // Verifica se tem 11 dígitos e se todos são iguais
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let primeiroDigitoVerificador = 11 - (soma % 11);
    if (primeiroDigitoVerificador >= 10) primeiroDigitoVerificador = 0;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let segundoDigitoVerificador = 11 - (soma % 11);
    if (segundoDigitoVerificador >= 10) segundoDigitoVerificador = 0;

    // Verifica se os dígitos verificadores estão corretos
    return (
        primeiroDigitoVerificador === parseInt(cpf.charAt(9)) &&
        segundoDigitoVerificador === parseInt(cpf.charAt(10))
    );
}

const setFieldStatus = (field, valid) => {
    if (valid) {
        field.setAttribute('class', 'form-control border-success');
    } else {
        field.setAttribute('class', 'form-control border-danger');
    }
}