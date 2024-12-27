const paginacao = async (path, pagina, limite, totalItens) => {
    const totalPages = Math.ceil(totalItens / limite);
    
    // Gerar URLs para cada página começando de 1
    const urls = Array.from({length: totalPages}, (_, i) => ({
        i: `?pag=${i + 1}&itensPorPagina=${limite}`
    }));
    
    return {
        path,
        pagina,
        primeira_pagina: urls.length > 0 ? urls[0].i : null,
        prev_page_url: pagina > 1 ? urls[pagina - 2]?.i : null, // página anterior
        next_page_url: pagina < totalPages ? urls[pagina]?.i : null, // próxima página
        totalPages,
        urls,
        total: totalItens,
        limite 
    }
}


const paginacaoPesquisa = async (path, pesquisa, pagina, limite, totalItens) => {
    const totalPages = Math.ceil(totalItens / limite);

    // Gerar URLs para cada página começando de 1
    const urls = Array.from({length: totalPages}, (_, i) => ({
        i: `?produto=${pesquisa}&pag=${i + 1}&itensPorPagina=${limite}`
    }));

    return {
        path,
        pagina,
        primeira_pagina: urls.length > 0 ? urls[0].i : null,
        prev_page_url: pagina > 1 ? urls[pagina - 2]?.i : null, // página anterior
        next_page_url: pagina < totalPages ? urls[pagina]?.i : null, // próxima página
        ultimaPagina: totalPages,
        urls,
        total: totalItens,
        limite 
    }
}


module.exports = {paginacao, paginacaoPesquisa}