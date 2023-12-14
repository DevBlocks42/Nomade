var fs = require("fs");
var crypto = require("crypto");
var path = require('path');

module.exports = 
{
    configMysql :
    {
        "host" : "127.0.0.1",
        "user" : "UNDEFINED",
        "password" : "UNDEFINED",
        "database" : "nomade"
    },
    configEmail : 
    {
        "host" : "smtp.UNDEFINED.email",
        "user" : "UNDEFINED",
        "pass" : "UNDEFINED",
        "port" : -1
    },
    configRoutes :
    {
        "index" : "../public/html/views/index.ejs",
        "login" : "../public/html/views/login.ejs",
        "logout" : "../public/html/views/logout.ejs",
        "register" : "../public/html/views/register.ejs",
        "member" : "../public/html/views/member.ejs",
        "messenger" : "../public/html/views/messenger.ejs",
        "activation" : "../public/html/views/activation.ejs",
        "discussion" : "../public/html/views/discussion.ejs"
    },
    configWebApp : 
    {
        "port" : 8080,
        "host" : "127.0.0.1"
    },
    configHTTPErrors :
    {
        "404" : "<!DOCTYPE html><html><head><meta charset = 'utf-8'><meta name = 'viewport' content = 'width=device-width, initial-scale=1'></head><body style = 'height: 100vh;'><p><b>Erreur HTTP 404</b>, la ressource à laquelle vous souhaitez accéder n'a pas été trouvé sur le serveur.</p></body></html>",
        "403" : "<!DOCTYPE html><html><head><meta charset = 'utf-8'><meta name = 'viewport' content = 'width=device-width, initial-scale=1'></head><body style = 'height: 100vh;'><p><b>Erreur HTTP 403</b>, la ressource à laquelle vous souhaitez accéder ne vous est pas accessible.</p></body></html>"
    },
    configInputRegex : 
    {
        "login" : /^[a-zA-Z0-9-_]{4,20}$/,
        "email" : /^([a-zA-Z0-9.\-_])+@([a-zA-Z0-9.\-_])+\.([a-zA-Z0-9.\-_])+$/,
        "password" : /^(.(^\s)*){6,32}$/,
        "description" : /^([a-zA-Z0-9\-\_\.\ ]){0,255}$/,
        "loginSearch" : /^([a-zA-Z0-9-_])*$/
    },
    configStaticMessages :
    {
        "welcome" : "&#9432; Bienvenue sur Nomade, veuillez <a href = '/login'>vous connecter</a> ou <a href = '/register'>vous inscrire</a> pour continuer.",
        "welcomeHome" : "&#9432; Bonjour ?, pour commencer à discuter, rendez vous sur votre <a href = '/messenger'><i>messagerie chiffrée</i></a>.",
        "welcomeActivation" : "&#9432; Félicitations, votre compte a été créé. Par mesure de sécurité, Nomade Secured Chat souhaite vérifier l'authenticité de votre adresse éléctronique. Veuillez vous rendre sur la boite mail renseignée lors de votre inscription, puis cliquez sur le lien d'activation que nous vous avons envoyé."
    },
    configForms : 
    {
        "login" :
        [
            ["Pseudonyme", "text", "", "username"],
            ["Mot de passe", "password", "", "password"]
        ],
        "register" :
        [
            ["Pseudonyme", "text", "", "username"],
            ["Adresse email", "email", "alice@nomade.fr", "email"],
            ["Mot de passe", "password", "", "password"],
            ["Confirmation du mot de passe", "password", "", "password_confirm"],
        ],
        "edit_profile_username" :
        [
            ["Pseudonyme", "text", "", "username"],
            ["Mot de passe", "password", "", "password"]
        ],
        "edit_profile_email" :
        [
            ["Nouvelle adresse email", "email", "", "new_email"],
            ["Confirmation de la nouvelle adresse email", "email", "", "new_email_confirm"],
            ["Mot de passe", "password", "", "password"]
        ],
        "edit_profile_password" :
        [
            ["Mot de passe actuel", "password", "", "current_password"],
            ["Nouveau mot de passe", "password", "", "new_password"],
            ["Confirmation nouveau mot de passe", "password", "", "new_password_confirm"]
        ],
        "edit_profile_description" :
        [
            ["Description", "text", "", "description"],
            ["Mot de passe", "password", "", "password"]
        ],
        "edit_profile_avatar" :
        [
            ["Choisissez une image", "file", " ", "avatar_file"],
            ["Mot de passe", "password", "", "password"]
        ],
        "remove_profile" :
        [
            ["Mot de passe", "password", "", "password_remove"]
        ]
    },
    configNavBars : 
    [
        ["Accueil", "/index", 0],
        ["Connexion", "/login", 0],
        ["Inscription", "/register", 0],
        ["Profil", "/member", 1],
        ["Messagerie", "/messenger", 1],
        ["Déconnexion", "/logout", 1],
    ],
    configSessions : 
    {
        secret : "UNDEFINED",
        saveUninitialized : true, 
        cookie : 
        {
            maxAge : 1000 * 60 * 60 * 24
        },
        resave : false
    },
    configStorage : 
    {
        destination: function (req, file, callback) 
        {
            fs.mkdir('./public/uploads', function(err) 
            {
                if(err) 
                {
                    callback(null, './public/uploads');
                } 
                else 
                {
                    callback(null, './public/uploads');
                }
            });
        },
        filename : function (req, file, callback) 
        {
            var name = crypto.randomBytes(32).toString("hex") + path.extname(file.originalname);
            callback(null, name);
        },
        limits : 
        {
            fileSize: 1000000
        },
        fileFilter (req, file, callback) 
        {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) 
            {
                return callback("Erreur : format de fichier invalide, les fichiers autorisés sont jpeg/jpg | png | gif et sa taille ne doit pas excéder 1Mo.");
            }
            callback(undefined, true);
        }
    }
};