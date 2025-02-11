module.exports = {
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.tipo === 0){
            return next()
        }
        req.flash('access_msg', "Você deve estar logado para acessar!.")
        res.redirect('/login')
    },
    logado: (req, res, next) => {
        if(req.isAuthenticated() && req.user.tipo === 1){
            return next()
        }
        req.flash('access_msg', "Você deve estar logado para acessar!")
        res.redirect('/login')
    }
}