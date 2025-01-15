document.onload = () => {
    navegacao("servicos")
    navegacao("contato")
    navegacao("sobre")
}


const navegacao = (topico) => {
    document.getElementById("a").addEventListener("click", function () {
        const target = document.getElementById(topico);
        const offsetTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
        });
    })
}