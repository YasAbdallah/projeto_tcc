const express = require("express")
const handlebars = require("express-handlebars")
const bodyparse = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const cookieParser = require('cookie-parser')
const flash = require("connect-flash")
const passport = require('passport')
require("./config/auth")(passport)
const db = require("./config/db")
const login = require('./routes/login/login')
const { config } = require("process")
const app = express()

//Configurações
 

app.use(cookieParser())

//  - Body parse
app.use(bodyparse.json())
app.use(bodyparse.urlencoded({extended:false}))
//Sessão
app.use(session({
    secret: 'projetoTCC-barbearia',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.access_msg = req.flash("access_msg")
    res.locals.login_msg = req.flash("login_msg")
    res.locals.logout_msg = req.flash("logout_msg")
    res.locals.erros = req.flash("erros")
    res.locals.user = req.user || null //Armazena dados do usuario logado
    next()
})


//  - handleBars
app.engine('handlebars', handlebars.engine({
    defaultLayout:'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))

app.set('view engine', 'handlebars')

//Configuração do mongoose - Testa em casa
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI).then(() => {
    console.log("Conectado com sucesso!")
}).catch(err => {
    console.log("Erro ao se conectar ao Banco de dados: "+err)
})

//Public

app.use(express.static(path.join(__dirname, "public")))
//Rotas
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login/index')
})

//app.use("/mensagem", mensagem)
app.get('*', (req, res) => {
    res.render('pagina-nao-encontrada/')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor Rodando.")
})
