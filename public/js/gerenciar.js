document.addEventListener('DOMContentLoaded', () => {
    const btnGerarCodigo = document.getElementById('gerarCodigo');
    
    btnGerarCodigo.onclick = () => {
        document.getElementById('codigo').value = gerarCodigo();
    };

    function gerarCodigo() {
        return Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    }
});