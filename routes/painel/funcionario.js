const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
require('../../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../../models/Barbeiro')
const Barbeiro = mongoose.model('barbeiro')

router.get('/', (req, res) => {
    res.render("painel/funcionario")
})

module.exports = router
