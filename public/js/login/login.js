import {popup} from "../funcoes.js"
const popupSucesso = document.getElementById("popupSucesso")
const popupErro = document.getElementById("popupErro")
window.onload = async () => {
    await handleForm()
}

const handleForm = async () => {
    const form = document.querySelector("form[id='formLogin']")
    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())
            try{
                const response = await fetch("/login/login", { //Aqui tem que ter o caminho e o nome da função! 
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                if(response.ok){
                    const result = await response.json()
                    if(result.sucesso){
                        await popup(popupSucesso, result)
                        result.dados.tipo == 1 ? window.location.href = "/painel/usuario" : window.location.href = "/painel/funcionario"
                    }else{
                        popup(popupErro, result)
                    }
                }
            }catch(error){
                popup(popupErro, {sucesso: false, message: "Ocorreu um erro inesperado."})
            }    
        })
    }
}
