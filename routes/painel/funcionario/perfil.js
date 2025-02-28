const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')
const {admin} = require("../../../helpers/verificarlogin")

router.get('/', admin, (req, res) => {
    res.render('painel/funcionario/perfil')
})

router.post("/alterarDados", admin, (req, res) => { })


module.exports = router
