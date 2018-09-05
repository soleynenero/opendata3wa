// on appelle mongoose pour utiliser le module
var mongoose = require("mongoose");

//récupération du module de hashage
const hash = require("./../hash");

// ici on met mongoose.shema dans une variable afin de pouvoir créer un shema qui sera notre table
var Shema = mongoose.Schema ;

// creation de notre shema user
var userShema = new Shema({
    firstname : { type: String, required : [true, 'Le champs "prénom" est obligatoire'] } ,
    lastname : { type: String, required : [true, 'Le champs "nom" est obligatoire'] } ,
    email : {
        type: String,
        validate: {
            validator: function(mailValue) {
                // c.f. http://emailregex.com/
                // permet de vérifié si l'email est bien un email
                const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegExp.test(mailValue);
            },
            message: 'L\'adresse email {VALUE} n\'est pas une adresse RFC valide.'
        },
        required : [true, 'Le champs "email" est obligatoire']
    } ,
    hash : { type: String , required : true} ,
    salt : { type: String , required : true} 
});

// ajout d'une méthode personnalisée signup pour incrire un utilisateur.
// cette methode accepte les 5 paramètres définissant un user
// [nomDuShema].statics.[nomDeLaMethodeACréer] 
userShema.statics.signup = function (firstname,lastname,email,pass,pass_confirmation){
    // Vérification des champs de mot de passe
    const pass_errors = []

    if (pass.trim() === '')
        pass_errors.push('Le champs "mot de passe" est obligatoire')

    if (pass_confirmation.trim() === '')
        pass_errors.push('Le champs "confirmation de mot de passe" est obligatoire')

    if (pass_errors.length === 0 && pass.trim() !== pass_confirmation.trim())
        pass_errors.push('Les mots de passe doivent être identiques')

    if (pass_errors.length > 0)
        return Promise.reject(pass_errors)
    // insertion en base, en utilisant la methode .create d'un model mondoose 
    // cette lethode renvoie une promesse js avec l'instruction return on renvoie donc la promesse comme valeur de usershema.statuc.signup
    return this.findOne({ email: email })
        .then(user => {
            if (user)
                return Promise.reject(new Error(`Cette adresse email est déjà utilisée (${user.email})`));
        })
        .then(() => hash(pass))
        .then( ({salt, hash}) => {
        return this.create({
            firstname : firstname,
            lastname : lastname,
            email : email,
            salt : salt,
            hash : hash
        })
    }).catch(err => {
        // Fabrication d'un tableau de messages d'erreur (extraits de l'objet 'ValidationError' renvoyé par Mongoose)
        if (err.errors)
            throw Object.keys(err.errors).map(field => err.errors[field].message);
        
        throw [err.message ? err.message : err];
    })
};

// creation de notre model : mongoose.model('[nomModel]',[nomShemaDuModel])
// export du model
module.exports = mongoose.model("User",userShema)