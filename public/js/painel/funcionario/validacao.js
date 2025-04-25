import { formatarData } from "../../funcoes.js";

window.onload = async () => {
    await dataAtual();

    const dataAgendada = document.getElementsByName(`dataAgendamento`)

    dataAgendada.forEach(data => {
        const dataFormatada = formatarData(data.textContent)
        data.textContent = dataFormatada
    })
}


const dataAtual = async () => {
    const spanDataAtual = document.getElementById('dataAtual');
    const pegaDataAtual = new Date().toLocaleDateString()
    return spanDataAtual.innerText = pegaDataAtual
}