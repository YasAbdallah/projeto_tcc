import {handleForm} from '../enviarForm.js';

window.onload = async () => {
    await handleForm('formCriarConta', '/criarConta/criarConta', '/login');
}