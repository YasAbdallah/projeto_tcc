window.onload = async () => {
    try {
        await formataDataNascimento()
        await preencherGenero()
    } catch (error) {
        popup(popupErro, { sucesso: false, message: `Ocorreu um erro tente mais tarde.` })
    }
}

const preencherGenero = async () => {
    document.getElementById('genero').addEventListener('change', function() {
        let outroGenero = document.getElementById('outroGenero')
        if (this.value === 'outro') {
            outroGenero.style.display = 'block'
            outroGenero.setAttribute('aria-required', 'true')
            outroGenero.setAttribute('required', 'true')
        } else {
            outroGenero.style.display = 'none'
            outroGenero.removeAttribute('aria-required')
            outroGenero.removeAttribute('required')
        }
    })
}

const formataDataNascimento = async () => {
    const campoData = document.getElementById("dataNascimento");
    const dataNaoFormatada = campoData.getAttribute("data-value");
    const data = new Date(dataNaoFormatada);// Formatando a data para o formato yyyy-MM-dd
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const dia = String(data.getDate()+1).padStart(2, '0'); // Dias são baseados em zero
    console.log(dataNaoFormatada, `${ano}-${mes}-${dia}`)
    return campoData.value = `${ano}-${mes}-${dia}`;
}

