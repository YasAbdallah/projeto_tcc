const navegacao = (topico) => {
    document.getElementById("a").addEventListener("click", function () {
        const target = document.getElementById(topico);
        const offset = 130; // Ajuste o valor do deslocamento conforme necessário
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: position,
            behavior: "smooth"
        });
    })
}
