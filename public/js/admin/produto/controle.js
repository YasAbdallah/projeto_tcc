import { popup } from "../../funcoes.js";
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
                            window.location.href = "/admin/produto" 
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

export {
    handleFormSubmit
};
