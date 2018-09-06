// CHARGE LES VARIABLES D'ENVIRONNEMENTs
require("dotenv").config();


/**
 * RÉCUPERATION MODULE
 */
// récupération d'express
const express = require("express");

// body-parser : fonction qui permettra de traiter les éléments de la requete
const bodyParser = require("body-parser"); 

const mongoose = require("mongoose");

const session = require('express-session');

const flash = require("connect-flash");

// récupération de la methode dans une variable
const app = express();


/**
 * MOTEUR TEMPLATING
 */

// indique a express que le moteur de templating a utiliser est pug
app.set("view engine","pug");

// indique a express que le dossier contenant les templates est "/views"
app.set("views","./views"); 



/**
 * MIDDLEWARE
*/
// permet d'utiliser les fichiers static se trouvant dans le dossier public 
app.use(express.static('public'));

// grace a ca tous les éléments auront les méthodes body qui contiendra nos datas ca sera l'équivalent de $_POST
app.use(bodyParser.urlencoded({extended:false}));

// app.use nous permet de chharger les middleware
// creation d'une session
app.use(session({
    secret: 'opendata3wa rocks',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// mettre en place des messages flash
// /!\ Bien le placer en dessous du app.use(session())
app.use(flash());

// creation de notre middleware 
// sur toutes les routes a condition qu'on les appelle dans notre route
app.use("[routeAPointerSiBesoin]",(req,res,next)=>{
    if(isnotadmin){
        req.flash('danger','acces interdit')
        return res.redirect('/')
    }
    else{
        next();
    }
})
app.use((req,res,next)=>{
    app.locals.flashMessages = req.flash()
    next()
})


/**
 *  ROUTE
 */
require("./app/routes")(app);


/**
 * CONNECTION BDD
 */
mongoose
    .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,{useNewUrlParser:true})
    .then(() =>{
    // serveur sur lequel je peux voir ce que j'envoie
    app.listen(8000,() => {
        console.info("serveur sur localhost:8000");
    });
})
