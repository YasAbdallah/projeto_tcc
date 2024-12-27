if(process.env.NODE_ENV == 'production'){
    //module.exports = {mongoURI: ''}
}else{
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017/almoxarifado'}
}
