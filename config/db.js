require('dotenv').config()

if(process.env.NODE_ENV == 'production'){
    //module.exports = {mongoURI: ''}
}else{
    module.exports = {mongoURI: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`}
}
