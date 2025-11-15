require('dotenv').config();

module.exports = {
    app:{
        port : process.env.PORTAPP || 3001,
        cors : process.env.CORSAPP
    }
};