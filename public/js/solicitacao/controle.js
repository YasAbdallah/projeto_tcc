import { popup } from "../funcoes.js";
import { contruirTabela } from "./construirTabela.js";
const popupSucesso = document.getElementById("popupSucesso");
const popupErro = document.getElementById("popupErro");

const handleFormSubmit = async (formName, endpoint) => {
    const forms = document.querySelectorAll(`form[name='${formName}']`);
    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if(result.sucesso){
                            await popup(popupSucesso, result)
                            await atualizarQuantidadeBotaoCarrinho()
                            await listaItensCarrinho()
                            await handleFormSubmit('solicitar', "/solicitar/solicitarItens")
                            await handleFormSubmit('removerItem', "/solicitar/removerItemCarrinho")
                            await handleFormSubmit('removerTodos', "/solicitar/removerTodosCarrinho")
                            await handleFormSubmit('alterarQuantidadeItem', "/solicitar/alterarQuantidadeItem")
                            //window.location.href = "/solicitar" 
                        }else{
                            await popup(popupErro, result);
                        }
                    }
                } catch (error) {
                    popup(popupErro, { sucesso: false, message: error });
                }
            });
        });
    }
};

const atualizarQuantidadeBotaoCarrinho = async () => {
    try{
        const botaoCarrinho = document.getElementsByName("quantidadeItens")
        const atualizarItensCarrinho = await fetch("/solicitar/quantidadeItensBotaoCarrinho", {
            method:"post",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(atualizarItensCarrinho.ok){
            const result = await atualizarItensCarrinho.json()
            botaoCarrinho.forEach(elem =>{
                elem.innerText = result.totalItensCarrinho
            })
            
        }else{
            popup(popupErro, atualizarItensCarrinho)
        }
    }catch(error){
        popup(popupErro, "Ocorreu um erro ao recuperar o carrinho. Código: cart-02.1")
    }
}

const listaItensCarrinho = async () => {
    const tbodyCarrinho = document.getElementById("tbodyCarrinho")
    tbodyCarrinho.innerHTML = ''
    try{
        const atualizarItensCarrinho = await fetch("/solicitar/conteudoCarrinho", {
            method:"get",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(atualizarItensCarrinho.ok){
            const result = await atualizarItensCarrinho.json()
            result.conteudo.forEach(itens => {
                delete itens.produto.saldo
                itens.produto.quantidade = itens.quantidade
                contruirTabela(itens.produto, itens._id)
            })
        }else{
            popup(popupErro, atualizarItensCarrinho)
        }
    }catch(error){
        popup(popupErro, {sucesso: false, message:"Ocorreu um erro ao recuperar o carrinho. Código: cart-02.1"})
    }
}
export {
    handleFormSubmit,
    atualizarQuantidadeBotaoCarrinho,
    listaItensCarrinho
};
