import {handleForm} from '../enviarForm.js';

window.onload = async () => {
    await handleForm('formEsqueciSenha', '/login/esquecerSenha/esquecerSenha', '/login');
}