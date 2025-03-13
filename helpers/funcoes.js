const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

module.exports = {
    formatarData: (data) => {
        const dataFormatada = data.split('-')
        return `${dataFormatada[2]}/${dataFormatada[1]}/${dataFormatada[0]}`
    },
    formatarDataBd: (data) => {
        const dataFormatada = String(data).split(' ')
        const meses = {
            "Jan": 'Janeiro',
            "Feb": 'Fevereiro',
            "Mar": 'Março',
            "Apr": 'Abril',
            "May": 'Maio',
            "Jun": 'Junho',
            "Jul": 'Julho',
            "Aug": 'Agosto',
            "Sept": 'Setembro',
            "Oct": 'Outubro',
            "Nov": 'Novembro',
            "Dec": 'Dezembro'
        }
        return `${dataFormatada[2]} de ${meses[dataFormatada[1]]} de ${dataFormatada[3]} às ${dataFormatada[4]}`
    },
    pegarDia: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[2]
    },
    pegarMes: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[1]
    },
    pegarAno: (data) => {
        const dataFormatada = data.split('-')
        return dataFormatada[0]
    },
    trocarOrdemData: (data) => {
        const dataFormatada = data.split('-')
        return `${dataFormatada[2]}-${dataFormatada[1]}-${dataFormatada[0]}`
    },
    validarCampo: (campo, mensagemDeErro) => {
        if (!campo || typeof campo === "undefined" || campo === null || String(campo).trim().length === 0) { return { texto: mensagemDeErro } }
        return null
    },
    validarCampoSenha: (campo, mensagemDeErro) => {
        if (!campo || String(campo).trim().length === 0 || String(campo).length < 8) { return { texto: mensagemDeErro } }
        return null
    },
    normalizeText: (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    gerarIdentificadorRequisicao: () => {
        const anoAtual = new Date().getFullYear();
        const codigoBase36 = Math.random().toString(36).substring(2, 8).toUpperCase(); // Gera uma string Base36 de 6 caracteres
        return `RQ${anoAtual}${codigoBase36}`;
    },
    validarEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email)
    },
    gerarToken: async (email) => {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' })
        return token
    },
    verificarToken: async (token) => {
        try {
            const resultado = jwt.verify(token, process.env.JWT_SECRET)
            return resultado
        } catch (error) {
            return null
        }
    },
    enviarEmailTrocarSenha: async (email, nomeCliente, pathTrocarSenah, token) => {
        const resetLink = `${process.env.NODE_URL}:${process.env.NODE_PORT}${pathTrocarSenah}?auth=${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                typw: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.MAIL_OAUTH_CLIENT_ID,
                clientSecret: process.env.MAIL_OAUTH_CLIENT_SECRET,
                refreshToken: process.env.MAIL_OAUTH_REFRESH_TOKEN
            }
        })

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Recuperação de senha. Projeto-TCC Barbearia",
            html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Redefinição de Senha</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #E7E5E2; /* cor1 */
                            color: #021130; /* cor2 */
                            text-align: justify;
                            padding: 20px;
                            line-height: 1.6;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #DFDDD9; /* cor5 */
                            padding: 30px;
                            margin: 20px auto;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                            color: #7A5604; /* cor3 */
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        p {
                            margin-bottom: 15px;
                            color: #424B5F; /* cor4 */
                        }
                        .button {
                            display: block;
                            width: 100%;
                            background-color: #021130; /* cor2 */
                            color: white;
                            text-align: center;
                            padding: 15px;
                            border-radius: 5px;
                            text-decoration: none;
                            font-size: 1.2em;
                            font-weight: bold;
                            margin-top: 20px;
                        }
                        .button:hover {
                            background-color: #5f4302; /* cor3-1 */
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #888;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Redefinição de Senha</h2>
                        <p>Olá, ${nomeCliente}</p>
                        <p>Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, pode ignorar este e-mail.</p>
                        <p>Para redefinir sua senha, clique no botão abaixo:</p>
                        <a href="${resetLink}" class="button">Redefinir Senha</a>
                        <p>O link expirará em 24 horas por motivos de segurança.</p>
                        <p>Se você precisar de ajuda, entre em contato conosco.</p>
                        <p class="footer">&copy; 2025 Sua Empresa - Todos os direitos reservados.</p>
                    </div>
                </body>
                </html>
            `
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return { sucesso: false, message: "Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde." }
            }
            return { sucesso: true, message: "E-mail enviado com sucesso. Verifique sua caixa de entrada ou span." }
        })
    },

    inicializarArray: async (obj, key) => {
        if (!Array.isArray(obj[key])) {
            return obj[key] = []
        }
    },

    adicionarValorArray: async (obj, key, value) => {
        if (!Array.isArray(obj[key])) {
            return obj[key] = [value]
        }
        return obj[key].push(value)
    },
    mascaraCPF: async (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    },
    removeMascaraCPF: async (cpf) => {
        return cpf.replace(/\D/g, '')
    },
}