import {popup} from "../funcoes.js";

const selectionBarbeiro = document.getElementById('barbeiro')
const selectionServico = document.getElementById('servico')
const selectionData = document.getElementById('data')
const selectionHorario = document.getElementById('horario')
const alertaData = document.getElementById('alertaData')

window.onload = async () => {
    await selectBarbeiro();
    await validarDia();
    await validarHorario();
}



const selectBarbeiro = async () => {
    selectionBarbeiro.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
    
        // Atualiza os serviços
        const servicos = selectedOption.getAttribute('data-servicos').split(',');
        selectionServico.innerHTML = '<option value="" disabled selected>Selecione o serviço desejado.</option>';
        servicos.forEach(function (servico) {
            const option = document.createElement('option');
            option.value = servico.trim();
            option.textContent = servico.trim();
            selectionServico.appendChild(option);
        });
        const diasDisponiveis = selectedOption.getAttribute('data-dias').split(',');
        const dias = diasDaSemana(diasDisponiveis);
        console.log(diasDisponiveis, dias)
        alertaData.innerText = "O barbeiro trabalha apenas às: \n" + dias.join(', ') + ".";
    });
}

const validarDia = async () => {
    selectionData.addEventListener('change', function () {
        const selectBarbeiro = document.getElementById('barbeiro');
        const selectedOption = selectBarbeiro.options[selectBarbeiro.selectedIndex];

        const dataSelecionada = new Date(document.getElementById("data").value);
        const diaSelecionado = dataSelecionada.getDay() + 1;
        const diasDisponiveis = selectedOption.getAttribute('data-dias');
        if (!diasDisponiveis.includes(diaSelecionado)) {
            popup(popupErro, {sucesso: false, message: 'O barbeiro não trabalha nesse dia. Por favor, escolha outro dia.'});
            this.value = '';
        }
    });
}

const diasDaSemana = (dias) => {
    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return dias.map(dia => diasDaSemana[dia]);
}


const validarHorario = async () => {
    selectionHorario.addEventListener('change', function() {
        const tempoSelecionado = this.value;
    
        const horas = parseInt(tempoSelecionado.split(':')[0], 10);
        
        // Verifica se o horário está entre 9h e 18h
        if (horas < 9 || horas >= 18) {
            popup(popupErro, {sucesso: false, message: 'Os barbeiros só trabalham entre 9h às 13h e 14h às 18h. Por favor, escolha um horário dentro desse intervalo.'});
            this.value = '';
        }
    });
}
