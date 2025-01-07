import { popup } from "./funcoes.js";
const popupSucesso = document.getElementById("popupSucesso");
const popupErro = document.getElementById("popupErro")

window.onload = async () => {
    try {
        await handleFormSubmit("whatsapp-handle")
    } catch (error) {
        popup(popupErro, { sucesso: false, message: `Ocorreu um erro tente mais tarde.` })
    }
}


const handleFormSubmit = async (formName, endpoint) => {
    const forms = document.querySelectorAll(`form[name='${formName}']`);
    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                try {
                    const { nome, telefone, email, mensagem } = data;
                    // Construir mensagem para WhatsApp
                    const texto = `Olá! Meu nome é ${nome}. Estou entrando em contato através do site. 
Segue abaixo os meus dados de contato: 

📞 Telefone: ${telefone}
📧 E-mail: ${email}

${mensagem}

Por favor, aguardo retorno. Desde já, agradeço pela atenção!`;
                    const url = `https://api.whatsapp.com/send?phone=+5567991678140&text=${encodeURIComponent(texto)}`;
                    window.open(url, "_blank");
                } catch (error) {
                    popup(popupErro, { sucesso: false, message: error });
                }
            });
        });
    }
};