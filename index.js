import express from "express";
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from "./router/userRoutes.js"
import db from "./config/database.js"
//const express = require('express');

const app = express();

//habilite read form data
app.use(express.urlencoded({extended: true}))

//habilite cookie parser
app.use(cookieParser());
//Habilite CSRF
app.use(csrf({cookie:true}));
//Connection database
try{
    await db.authenticate();
    console.log('Correct connection');
}catch(error){
    console.log(error);
}

//habilite Pug
app.set('view engine', 'pug');
app.set('views', './views');


//public
app.use(express.static('public'));
app.use('/auth', userRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});