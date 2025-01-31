import { validarEmail, validarTelefone } from "../funcoes.js"

const inputEmail = document.getElementById('email')
const alertaConfirmarSenha = document.getElementById('alertaConfirmarSenha')
const inputConfirmarSenha = document.getElementById('confirmarSenha')
const inputSenha = document.getElementById('senha')
const inputTelefone = document.getElementById('telefone')
const inputNome = document.getElementById('nome')
const buttonCriarConta = document.getElementById('buttonCriarConta')

inputNome.addEventListener('keyup', () => {
    inputNome.value = inputNome.value.replace(/[^a-zA-Z ]/g, "")
})

inputTelefone.addEventListener("keyup", () => {
    inputTelefone.value = validarTelefone(inputTelefone.value)
})

inputEmail.addEventListener('focusout', () => {
    validarEmail(inputEmail.value) ? inputEmail.style.border = '1px solid green' : inputEmail.style.border = '1px solid red'
})

inputConfirmarSenha.addEventListener('focusout', () => {
    if (inputSenha.value !== inputConfirmarSenha.value) {
        alertaConfirmarSenha.textContent = "As senhas não coincidem"
        inputConfirmarSenha.style.border = '1px solid green'
        alertaConfirmarSenha.style.color = 'red'
        buttonCriarConta.disabled = true
    }else{
        inputSenha.style.border = '1px solid green'
        inputConfirmarSenha.style.border = '1px solid green'
        buttonCriarConta.disabled = false
    }
})