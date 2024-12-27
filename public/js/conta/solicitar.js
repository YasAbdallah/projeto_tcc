import {popup} from "../funcoes.js"
const popupSucesso = document.getElementById("popupSucesso")
const popupErro = document.getElementById("popupErro")

window.onload = async () => {
    await formularioSolicitar()
}


const formularioSolicitar = async () => {
    const form = document.querySelector("form[id='formSolicitar']")
    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())
            try{
                const response = await fetch("/conta/solicitar", { //Aqui tem que ter o caminho e o nome da função! 
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                if(response.ok){
                    const result = await response.json()
                    if(result.sucesso){
                        await popup(popupSucesso, result)
                        window.location.href = "/"
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