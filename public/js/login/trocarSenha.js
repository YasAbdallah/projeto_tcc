import {popup} from "../funcoes.js"
const popupSucesso = document.getElementById("popupSucesso")
const popupErro = document.getElementById("popupErro")

window.onload = async () => {
    await formularioTrocarSenha()
}


const formularioTrocarSenha = async () => {
    const form = document.querySelector("form[id='formTrocarSenha']")
    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())
            data.cpf = data.cpf.replace(/\D/g, "")
            try{
                const response = await fetch("/login/trocarSenha/trocarSenha", { //Aqui tem que ter o caminho e o nome da função! 
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                if(response.ok){
                    const result = await response.json()
                    if(result.sucesso){
                        await popup(popupSucesso, result)
                        window.location.href = "/login"
                    }else{
                        popup(popupErro, result)
                    }
                }
            }catch(error){
                popup(popupErro, {sucesso: false, message: error})
            }    
        })
    }
}