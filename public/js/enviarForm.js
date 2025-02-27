import {popup} from "./funcoes.js"

export const handleForm = async (idFormulario, router, redirecionarPag) => {
    const form = document.querySelector(`form[id="${idFormulario}"]`)
    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            
            const formData = new FormData(form)
            const data = Object.fromEntries(formData.entries())
            try{
                const response = await fetch(router, { //Aqui tem que ter o caminho e o nome da função! 
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                if(response.ok){
                    const result = await response.json()
                    if(result.sucesso){
                        await popup(popupSucesso, result)
                        if(redirecionarPag){
                            window.location.href = redirecionarPag
                        }
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