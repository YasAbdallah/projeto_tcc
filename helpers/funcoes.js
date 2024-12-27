module.exports = {
    formatarData: (data) => {
        const dataFormatada = data.split('-')
        return `${dataFormatada[2]}/${dataFormatada[1]}/${dataFormatada[0]}`
    },
    formatarDataBd: (data) => {
        const dataFormatada = String(data).split(' ')
        const meses = {"Jan": 'Janeiro',
            "Feb": 'Fevereiro',
            "Mar": 'Março',
            "Apr": 'Abril',
            "May": 'Maio',
            "Jun": 'Junho',
            "Jul": 'Julho',
            "Aug": 'Agosto',
            "Sept": 'Setembro',
            "Oct": 'Outubro',
            "Nov": 'Novembro',
            "Dec": 'Dezembro'}
        return `${dataFormatada[2]} de ${meses[dataFormatada[1]]} de ${dataFormatada[3]} às ${dataFormatada[4]}`
    },
    pegarDia: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[2]
    },
    pegarMes: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[1]
    },
    pegarAno: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[0]
    },
    trocarOrdemData: (data) => {
        const dataFormatada = data.split('-')
        return `${dataFormatada[2]}-${dataFormatada[1]}-${dataFormatada[0]}`
    },
    validarCampo: (campo, mensagemDeErro) => {
        if(!campo || typeof campo === "undefined" || campo === null || String(campo).trim().length === 0){return {texto: mensagemDeErro}}
        return null
    },
    validarCampoSenha: (campo, mensagemDeErro) => {
        if(!campo || String(campo).trim().length === 0 || String(campo).length < 8){return {texto: mensagemDeErro}}
        return null
    },
    normalizeText: (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    gerarIdentificadorRequisicao: () => {
        const anoAtual = new Date().getFullYear();
        const codigoBase36 = Math.random().toString(36).substring(2, 8).toUpperCase(); // Gera uma string Base36 de 6 caracteres
        return `RQ${anoAtual}${codigoBase36}`;
    }
}