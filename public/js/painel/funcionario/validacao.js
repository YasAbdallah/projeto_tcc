window.onload = async () => {
    await dataAtual();
}


const dataAtual = async () => {
    const spanDataAtual = document.getElementById('dataAtual');
    const pegaDataAtual = new Date().toLocaleDateString()
    return spanDataAtual.innerText = pegaDataAtual
}