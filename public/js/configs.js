const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
const tiposUsuarios = document.getElementsByName('tipousuario').forEach(conteudo => {
    const tipo = conteudo.innerText === '0' ? 'Usuário Comum' : "Adminstrador"
    conteudo.innerText = tipo
})

const aprovado = document.getElementsByName('aprovado').forEach(conteudo => {
    const tipo = conteudo.innerText === '0' ? '<i class="fa-solid fa-x"></i>' : '<i class="fa-solid fa-check" style="color: #27d39f;"></i>'
    conteudo.innerHTML = tipo
})
const solicitacao = document.getElementsByName('solicitacao').forEach(conteudo => {
    switch(conteudo.innerText){
        case '0':
            conteudo.innerText = 'Para aprovação'
            break
        case '1':
            conteudo.innerText = 'Criado pelo Administrador'
            break
        case '2':
            conteudo.innerText = 'Aprovado pelo Administrador'
            break
    }
})
