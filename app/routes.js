// creation
const User = require("./models/UserModel");

module.exports = function(app){
    // creation d'une route en get pour afficher Hello World :*
    app.get('/', function(req,res){
        // si on ne met pas la ligne res.setHeader le framework express mettre en place directement en Header cohérent avec ce qu'on envoie
        // ligne suivant a mettre en commentaire sinon PUG va interprété le header.
        // res.setHeader("Content-Type","text/plain");

        // render("[nomdufichier]",{paramètre utiliser dans le fichier index})
        res.render("index",{title : "Coucou", message : "Hello Babe !"});
    });

    app.get('/login', function(req,res){
        res.render("login");
    })

    app.get('/register', function(req,res){
        res.render("register");
    })

    app.post('/register',function(req,res){
        console.log(req.body);
        // on appelle la fonction signup qui se trouve dans le model user les paramètres utilisés sont ceux des names du formulaire
        User.signup(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password,
            req.body.password_confirmation
        ).then(()=>{
            res.redirect("/?register=ok")
        }).catch(errors =>{
            res.render("register.pug", {errors, user: req.body})
        })
    })
}