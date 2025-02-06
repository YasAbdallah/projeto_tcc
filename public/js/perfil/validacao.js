import { validarEmail, validarTelefone } from "../funcoes.js"
const email = document.getElementById('email')
const telefone = document.getElementById('telefone')
window.onload = async () => {
    preencherGenero()
    email.addEventListener("focusout", () => {
        validarEmail(email.value) ? email.style.border = "1px solid green" : email.style.border = "1px solid red"
    })
    telefone.addEventListener("keyup", () => {
        telefone.value = validarTelefone(telefone.value)
    })
}


const preencherGenero = () => {
    document.getElementById('genero').addEventListener('change', function() {
        let outroGenero = document.getElementById('outroGenero')
        if (this.value === 'outro') {
            outroGenero.style.display = 'block'
            outroGenero.setAttribute('aria-required', 'true')
            outroGenero.setAttribute('required', 'true')
        } else {
            outroGenero.style.display = 'none'
            outroGenero.removeAttribute('aria-required')
            outroGenero.removeAttribute('required')
        }
    })
}