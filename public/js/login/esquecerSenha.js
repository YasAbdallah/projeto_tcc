import {handleForm} from '../enviarForm.js';

window.onload = async () => {
    await handleForm('formEsqueciSenha', '/esquecerSenha/esquecerSenha', '/login');
}