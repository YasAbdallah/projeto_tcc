import { formatarData } from "../funcoes.js";


window.onload = async () => {
    const dataAgendada = document.getElementsByName(`dataAgendamento`)

    dataAgendada.forEach(data => {
        const dataFormatada = formatarData(data.textContent)
        data.textContent = dataFormatada
    })
}