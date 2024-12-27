let data = new Date()
const calendario = {
    dia: {
        0: 'Domingo',
        1: 'Segunda-feira',
        2: 'Terça-feira',
        3: 'Quarta-feira',
        4: 'Quinta-feira',
        5: 'Sexta-feira',
        6: 'Sábado'
    },
    mes: {
        0: 'Janeiro',
        1: 'Fevereiro',
        2: 'Março',
        3: 'Abril',
        4: 'Maio',
        5: 'Junho',
        6: 'Julho',
        7: 'Agosto',
        8: 'Setembro',
        9: 'Outubro',
        10: 'Novembro',
        11: 'Dezembro'
    },
    day: {
        'Sun': 'Domingo',
        'Mon': 'Segunda-feira',
        'Tue': 'Terça-feira',
        'Wed': 'Quarta-feira',
        'Thu': 'Quinta-feira',
        'Fri': 'Sexta-feira',
        'Sat': 'Sábado'
    },
    month: {
        "Jan": 'Janeiro',
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
        "Dec": 'Dezembro'
    }
}


const getData = document.getElementsByName("data").forEach((conteudo) => {
    const separaData = conteudo.innerText
    conteudo.innerText = `${separaData.slice(8, 10)} de ${calendario.month[separaData.slice(4, 7)]} de ${separaData.slice(11, 15)} às ${separaData.slice(16, 21)}h.`
})