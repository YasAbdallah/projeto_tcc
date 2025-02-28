const dataAtual = async () => {
    const spanDataAtual = document.getElementById('dataAtual');
    const pegaDataAtual = new Date().toLocaleDateString()
    return spanDataAtual.innerText = pegaDataAtual
}

const tagBarbeiro = async (tagName) => {
    document.addEventListener('DOMContentLoaded', function (event) {
        event.preventDefault();
        const tagContainer = document.querySelector('.tag-container');
        const input = document.getElementById('servico');
        const servicos = document.getElementsByName(tagName)[0];
        

        input.addEventListener('keypress', function () {
            if (event.key === 'Enter') {
                const tagText = input.value.trim();
                if (tagText) {
                    servicos.appendChild(addTag(tagText));
                    input.value = "";
                }
            }
        });
        function addTag(text) {
            
            const tag = document.createElement('span');
            tag.classList.add('tag');
            tag.setAttribute("value", text)
            tag.textContent = text;

            const removeBtn = document.createElement('span');
            removeBtn.classList.add('remove-tag');
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', function () {
                tagContainer.removeChild(tag);
            });

            tag.appendChild(removeBtn);
            return tagContainer.appendChild(tag, input);
        }
    });
}

await tagBarbeiro('servicos')
await tagBarbeiro('dias')
