module.exports = {
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.tipoUsuario == 1){
            return next()
        }
        req.flash('access_msg', "Você deve estar logado para acessar!.")
        res.redirect('/')
    },
    logado: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('access_msg', "Você deve estar logado para acessar!")
        res.redirect('/')
    }
}