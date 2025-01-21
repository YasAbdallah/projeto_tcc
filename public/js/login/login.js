import {popup} from "../funcoes.js"
const popupSucesso = document.getElementById("popupSucesso")
const popupErro = document.getElementById("popupErro")
window.onload = async () => {
    await formulariologin()
}


const formulariologin = async () => {
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
                    console.log(response)
                    if(result.sucesso){
                        await popup(popupSucesso, result)
                        window.location.href = "/"
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
