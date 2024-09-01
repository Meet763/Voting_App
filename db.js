const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.DB_URL_LOCAL
//const mongoURL = process.env.DB_URL

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log("connection is established")
})

db.on('disconnected', () => {
    console.log("mongo disconnected")
})

db.on('error', (err) => {
    console.log("mongo  error")
})

module.exports  = db;