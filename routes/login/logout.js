const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    req.logout((error) => {
        if(error) return next(error)
        req.flash("logout_msg", "Até a próxima.")
        res.redirect("/login")
    })
})

module.exports = router