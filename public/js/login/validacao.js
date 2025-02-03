import { validarEmail, validarTelefone } from "../funcoes.js"

const inputEmail = document.getElementById('email')
const buttonSubmit = document.getElementById('btnSolicitar')


inputEmail.addEventListener('keyup', () => {
    if(!validarEmail(inputEmail.value)){
        inputEmail.style.border = '1px solid red'
        buttonSubmit.disabled = true
    }else{
        inputEmail.style.border = '1px solid green'
        buttonSubmit.disabled = false
    }
})