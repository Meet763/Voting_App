const express = require('express');
const app = express();
const bodyParsor = require('body-parser');
const db = require('./db');
app.use(bodyParsor.json());
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')

app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)

app.listen(PORT, () => {
    console.log("server is on")
})