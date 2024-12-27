export function popup(elemento, objeto){
    return new Promise(resolve => {
        elemento.hidden = false
        const mensagem = document.querySelector(`div[data-mensagem="${objeto.sucesso}"]`)
        const tagP = document.createElement('p')
        tagP.innerText = `${objeto.message}`
        mensagem.appendChild(tagP)
        setTimeout(() => {
            elemento.hidden = true
            tagP.innerText = ""
            resolve()
        }, 2000)
    })
}

export function formatarData(data){
    const formatarData = new Date(data)

    return formatarData.toLocaleString()
}

export function criarTag(tag, atributos={}, texto = ''){
    const element = document.createElement(`${tag}`)
    Object.keys(atributos).forEach(atributo => {element.setAttribute(atributo, atributos[atributo])})
    if(texto) element.textContent=texto
    return element
}

export function criarDiv(){
    const divRow = criarTag('div', {class:"row mb-3"})
    return divRow
}