import { criarTag } from "./funcoes.js";

export const construirPaginacao = async (paginas = {}) => {
    const paginacao = criarTag('ul', { class: 'pagination justify-content-end' });

    // Página anterior
    if (!paginas.prev_page_url) {
        const liAnterior = criarTag('li', { class: 'page-item disabled' });
        const aAnterior = criarTag('a', { href: '#', class: 'page-link disabled', id: 'prev-page' }, 'Anterior');
        liAnterior.appendChild(aAnterior);
        paginacao.appendChild(liAnterior);
    } else {
        const liAnterior = criarTag('li', { class: 'page-item' });
        const aAnterior = criarTag('a', { href: `${paginas.path}${paginas.prev_page_url}`, class: 'page-link', id: 'prev-page' }, 'Anterior');
        liAnterior.appendChild(aAnterior);
        paginacao.appendChild(liAnterior);
    }

    // Páginas intermediárias
    paginas.urls.forEach((url, index) => {
        const liPagina = criarTag('li', { class: 'page-item' });
        const aPagina = criarTag('a', { class: 'page-link', href: `${paginas.path}${url.i}`, id: `page-${index + 1}` }, index + 1);
        liPagina.appendChild(aPagina);
        paginacao.appendChild(liPagina);
    });

    // Próxima página
    if (!paginas.next_page_url) {
        const liProxima = criarTag('li', { class: 'page-item disabled' });
        const aProxima = criarTag('a', { href: '#', class: 'page-link disabled', id: 'next-page' }, 'Próximo');
        liProxima.appendChild(aProxima);
        paginacao.appendChild(liProxima);
    } else {
        const liProxima = criarTag('li', { class: 'page-item' });
        const aProxima = criarTag('a', { href: `${paginas.path}${paginas.next_page_url}`, class: 'page-link', id: 'next-page' }, 'Próximo');
        liProxima.appendChild(aProxima);
        paginacao.appendChild(liProxima);
    }

    return paginacao;
};

export const transicaoLinkPaginacao = async () => {
    const linksPag = document.querySelectorAll('.page-link');
    const paginaAtual = extrairNumeroPagina(window.location.search);
    const ultimaPagina = linksPag.length - 1;

    // Atualizar e marcar a página atual
    atualizarLinksPaginacao(paginaAtual, linksPag, ultimaPagina);
    paginaAtualAtiva(paginaAtual);
};

// Extrair o número da página atual da URL
const extrairNumeroPagina = (queryString) => {
    const match = queryString.match(/\?pag=(\d+)/);
    return match ? Number(match[1]) : 1;
};

// Atualizar links de paginação para mostrar apenas os próximos e anteriores à página atual
const atualizarLinksPaginacao = (paginaAtual, links, ultimaPagina) => {
    links.forEach((link, index) => {
        const numeroPagina = Number(link.innerText);
        if (!isNaN(numeroPagina)) {
            const foraDoAlcance = (paginaAtual - 1) > numeroPagina || (paginaAtual + 2) < numeroPagina && index < ultimaPagina - 2;
            if (foraDoAlcance) link.parentElement.classList.add("d-none");
        }
    });
};

// Ativar a página atual visualmente
const paginaAtualAtiva = (paginaAtual) => {
    const botaoPagina = document.querySelector(`#page-${paginaAtual}`);
    if (botaoPagina) botaoPagina.classList.add("active");
};



