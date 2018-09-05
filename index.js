// CHARGE LES VARIABLES D'ENVIRONNEMENTs
require("dotenv").config();
// récupération d'express
const express = require("express");

// body-parser : fonction qui permettra de traiter les éléments de la requete
const bodyParser = require("body-parser"); 

const mongoose = require("mongoose");

// récupération de la methode dans une variable
const app = express();

// indique a express que le moteur de templating a utiliser est pug
app.set("view engine","pug");

// indique a express que le dossier contenant les templates est "/views"
app.set("views","./views"); 

// permet d'utiliser les fichiers static se trouvant dans le dossier public 
app.use(express.static('public'));

// grace a ca tous les éléments auront les méthodes body qui contiendra nos datas ca sera l'équivalent de $_POST
app.use(bodyParser.urlencoded({extended:false}));

require("./app/routes")(app);

mongoose
    .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,{useNewUrlParser:true})
    .then(() =>{
    // serveur sur lequel je peux voir ce que j'envoie
    app.listen(8000,() => {
        console.info("serveur sur localhost:8000");
    });
})
