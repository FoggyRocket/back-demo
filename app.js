//despues de crear tu .env debes importarlo
require("dotenv").config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose')




//Agregamos la conexion de mongoose

mongoose
    .connect(process.env.DB,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then((x)=>{
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        )
    })
    .catch((err)=>{
        console.log("Error connecting to mongo",err)
    })
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//rutas agregar prefijo "api" para diferenciar rutas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/api', indexRouter);
app.use('/api/auth', usersRouter);



module.exports = app;
