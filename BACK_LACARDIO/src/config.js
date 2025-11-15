require('dotenv').config();

module.exports = {
    app:{
        port : process.env.PORTAPP || 3001,
        cors : process.env.CORSAPP
    },
    postgreslacardio:{
        host : process.env.HOSTLACARDIO,
        database : process.env.DATABASEPGLACARDIO,
        user : process.env.USERPGLACARDIO,
        password : process.env.PASSWORDPGLACARDIO,
        port : process.env.PORTPGLACARDIO
    }
};