var config = require("./modules/config");
var form = require("./modules/form");
var database = require("./modules/database");
var databaseConnection = database.database(config.configMysql).createConnection();
var user = require("./modules/user").user(databaseConnection);
var discussion = require("./modules/discussion").discussion(databaseConnection);
var mysql = require("mysql");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var express = require("express");
var sessions = require("express-session");
var multer = require("multer");
var sharp = require("sharp");
var fs = require("fs");
const { Console } = require("console");
var storage = multer.diskStorage(config.configStorage);
var upload = multer({ storage, fileFilter : config.configStorage.fileFilter });
var webApp = express();

function main()
{
    console.log("[*] Serveur en cours d'exécution.");
    webApp.set("view engine", "ejs");
    webApp.use(express.static('public'));
    webApp.use(express.urlencoded({extended: true})); 
    config.configSessions["secret"] = crypto.randomBytes(128).toString("hex");
    webApp.use(sessions(config.configSessions));
    process.env.TZ = "Europe/Amsterdam";
    databaseConnection.connect();
    webApp.get("/activation/:hash", function (req, res)
    {
        onGetRequestReceived(req, res, true, "hash");    
    });
    webApp.get("/messenger/new/:fromuserid/:touserid", function (req, res)
    {
        onGetRequestReceived(req, res, true, "fromuserid"); 
    });
    webApp.get("/messenger/:fromuserid/:touserid", function (req, res)
    {
        onGetRequestReceived(req, res, true, "fuserid"); 
    });
    webApp.get("*", function (req, res)
    {
        console.log("    --> Réception d'une requête GET depuis " + req.ip + " vers " + req.url);
        onGetRequestReceived(req, res, false, null);
    });
    webApp.post("*", upload.single("avatar_file"), async function (req, res)
    {
        console.log("    --> Réception d'une requête POST depuis " + req.ip + " vers " + req.url);
        onPostRequestReceived(req, res);
    });
}
async function onGetRequestReceived(request, response, hasParam, paramName)
{
    if(!hasParam)
    {
        if(request.url === "/" || request.url === "/index")
        {
            if(!request.session.userDatas)
            {
                response.render(config.configRoutes["index"], { userDatas : request.session.userDatas, welcomeMessage : config.configStaticMessages["welcome"], navBarContent : config.configNavBars });
            }
            else 
            {
                response.render(config.configRoutes["index"], { userDatas : request.session.userDatas, welcomeMessage : config.configStaticMessages["welcomeHome"].replace("?", request.session.userDatas["username"]), navBarContent : config.configNavBars });
            }
        }
        else if(request.url === "/login")
        {
            if(!request.session.userDatas)
            {
                var f = form.form("/login", config.configForms["login"], "Connexion");
                response.render(config.configRoutes["login"], { userDatas : request.session.userDatas, loginForm : f.print(), navBarContent : config.configNavBars, errors : [] });
            }
            else 
            {
                response.redirect("/member");
            }
        }
        else if(request.url === "/register")
        {
            var f = form.form("/register", config.configForms["register"], "Valider");
            response.render(config.configRoutes["register"], { userDatas : request.session.userDatas, registerForm : f.print(), navBarContent : config.configNavBars, errors : [] });
        }
        else if(request.url === "/messenger") 
        { 
            if(request.session.userDatas)  
            {
                var uid = await user.getUserID(request.session.userDatas["username"]);
                var activeDiscussions = await discussion.getUserDiscussions(uid);
                var discussionInfos = [];
                if(activeDiscussions !== null)
                {
                    
                    for(var i = 0; i < activeDiscussions.length; i++)
                    {
                        var names = [];
                        var discussionUserIDS = await discussion.getDiscussionUserIDS(activeDiscussions[i]); 
                        names.push(await user.getUserName(discussionUserIDS[0]));
                        names.push(await user.getUserName(discussionUserIDS[1]));
                        names.push(discussionUserIDS[0]);
                        names.push(discussionUserIDS[1]);
                        discussionInfos.push(names);
                    }
                }
                response.render(config.configRoutes["messenger"], { discussions : discussionInfos, navBarContent : config.configNavBars, userDatas : request.session.userDatas, searchResult : [] });
            }
            else 
            {
                response.redirect("/login");
            }
        }
        else if(request.url === "/member")
        {
            if(request.session.userDatas)
            {
                var usernameForm = form.form("/member", config.configForms["edit_profile_username"], "Valider").print();
                var emailForm = form.form("/member", config.configForms["edit_profile_email"], "Valider").print();
                var passwordForm = form.form("/member", config.configForms["edit_profile_password"], "Valider").print();
                var descriptionForm = form.form("/member", config.configForms["edit_profile_description"], "Valider").print();
                var avatarForm = form.form("/member", config.configForms["edit_profile_avatar"], "Valider").print(true);
                var deleteForm = form.form("/member", config.configForms["remove_profile"], "Supprimer mon compte").print();
                response.render(config.configRoutes["member"], { profileForms : [usernameForm, emailForm, passwordForm, descriptionForm, avatarForm, deleteForm], userDatas : request.session.userDatas, welcomeMessage : config.configStaticMessages["welcomeHome"].replace("?", request.session.userDatas["username"]), navBarContent : config.configNavBars, userDatas : request.session.userDatas });
            }
            else 
            {
                var f = form.form("/login", config.configForms["login"], "Connexion");
                response.render(config.configRoutes["login"], { userDatas : request.session.userDatas, loginForm : f.print(), navBarContent : config.configNavBars, errors : [] });
            }
        }
        else if(request.url === "/logout")
        {
            if(request.session.userDatas)
            {
                request.session.destroy();
                response.redirect("/index");
            }
            else 
            {
                response.status(404).send(config.configHTTPErrors["404"]);
            }
        }
        else 
        {
            response.status(404).send(config.configHTTPErrors["404"]);
        }
    }
    else 
    {
        if(paramName === "hash")
        {
            user.checkActivation(request.params.hash, function (state)
            {
                if(state)
                {
                    user.activateUser(request.params.hash, function (state)
                    { 
                        if(state)
                        {
                           response.status(307).send("<script>alert('Votre compte a bien été activé, vous pouvez désormais vous connecter.'); window.location.href='/login';</script>Cliquez <a href = '/login'>ici</a> si vous n'êtes pas automatiquement redirigé.");
                        }
                    });
                }
                else 
                {
                    console.log("[!] Signature introuvable : impossible d'activer un compte utilisateur, hash : " + request.params.hash);
                    response.status(404).send(config.configHTTPErrors["404"]);
                }
            });
        }  
        else if(paramName == "fromuserid")
        {
            if(request.session.userDatas)
            {
                if(request.params.fromuserid && request.params.touserid)
                {
                    user.getUserID(request.session.userDatas["username"]).then((userid) => 
                    {
                        if(request.params.fromuserid == userid)
                        {
                            discussion.discussionExists(userid, request.params.touserid).then((exists) => 
                            {
                                if(!exists)
                                {
                                    discussion.createDiscussion(user, userid, request.params.touserid, function (state)
                                    {
                                        if(state)
                                        {
                                            response.redirect("/messenger/" + userid + "/" + request.params.touserid);
                                        }
                                    });
                                }
                                else 
                                {
                                    response.redirect("/messenger/" + userid + "/" + request.params.touserid);
                                }
                            });  
                        }
                        else 
                        {
                            console.log("[!] Accès non autorisé fromuserid : " + request.params.fromuserid);
                            response.status(403).send(config.configHTTPErrors["403"]);
                        }
                    });
                    
                }
            }
        }
        else if(paramName == "fuserid")
        {
            if(request.session.userDatas)
            {
                if(request.params.fromuserid && request.params.touserid)
                {
                    
                    var order = -1;
                    user.getUserID(request.session.userDatas["username"]).then( async (userid) => 
                    {
                        if(request.params.fromuserid == userid)
                        {
                            order = 0;
                        }
                        else if(request.params.touserid == userid)
                        {
                            order = 1;
                        }
                        if(order === 0) //fromuserid -> touserid
                        {
                            var receiver = await user.getUserName(request.params.touserid);
                            discussion.discussionExists(userid, request.params.touserid).then( async (exists) => 
                            {
                                if(exists)
                                {
                                    var discussionID = await discussion.getDiscussionID(request.params.fromuserid, request.params.touserid);
                                    var issuerPasswordHash = await user.getUserPasswordHash(userid);
                                    var issuerPublicKey = await discussion.getUserPublicKey(discussionID, userid);
                                    var issuer = await user.getUserName(request.params.fromuserid);
                                    var nameToShow = "";
                                    if(issuer === request.session.userDatas["username"])
                                    {
                                        nameToShow = receiver;
                                    }
                                    else 
                                    {
                                        nameToShow = issuer;
                                    }
                                    discussion.getDiscussionCertificates(discussionID, request.params.fromuserid, request.params.touserid, function (certificates)
                                    {
                                        response.render(config.configRoutes["discussion"], {name : nameToShow, currentUsername : issuer, order : 0, discID : discussionID, issuerPublic : issuerPublicKey, issuerHash : issuerPasswordHash, pgpCertificates : certificates, issuerName : issuer, receiverName : receiver, user : user, fromUserID : request.params.fromuserid, toUserID : request.params.touserid, userDatas : request.session.userDatas, navBarContent : config.configNavBars});  
                                    });
                                }
                                else 
                                {
                                    response.status(404).send(config.configHTTPErrors["404"]);
                                }
                            });
                        }
                        else if(order === 1) //touserid -> fromuserid
                        {
                            var receiver = await user.getUserName(request.params.touserid);
                            discussion.discussionExists(request.params.fromuserid, userid).then( async (exists) => 
                            {
                                if(exists)
                                {
                                    var discussionID = await discussion.getDiscussionID(request.params.fromuserid, request.params.touserid);
                                    var issuerPasswordHash = await user.getUserPasswordHash(userid);
                                    var issuerPublicKey = await discussion.getUserPublicKey(discussionID, userid);
                                    var issuer = await user.getUserName(request.params.fromuserid);
                                    var nameToShow = "";
                                    if(issuer === request.session.userDatas["username"])
                                    {
                                        nameToShow = receiver;
                                    }
                                    else 
                                    {
                                        nameToShow = issuer;
                                    }
                                    discussion.getDiscussionCertificates(discussionID, request.params.touserid, request.params.fromuserid, function (certificates)
                                    {
                                        response.render(config.configRoutes["discussion"], {name : nameToShow, currentUsername : receiver, order : 1, discID : discussionID, issuerPublic : issuerPublicKey, issuerHash : issuerPasswordHash, pgpCertificates : certificates, issuerName : issuer, receiverName : receiver, user : user, fromUserID : request.params.fromuserid, toUserID : request.params.touserid, userDatas : request.session.userDatas, navBarContent : config.configNavBars});  
                                    });
                                }
                                else 
                                {
                                    response.status(404).send(config.configHTTPErrors["404"]);
                                }
                            });
                        }
                        else 
                        {
                            response.status(404).send(config.configHTTPErrors["404"]);
                        }
                    });
                }
            }
        }
    }
    console.log("    <-- Envoi d'une réponse à " + request.ip + " status " + response.statusCode);
}
async function onPostRequestReceived(request, response, hasParam = false, paramName = "")
{
    if(!hasParam)
    {
        if(request.url === "/register")
        {
            var formErrors = user.checkRegisterForm(config.configInputRegex, request.body.username, request.body.email, request.body.password, request.body.password_confirm)
            if(formErrors.length === 0)
            {
                var username = mysql.escape(request.body.username).replaceAll("'", "");
                var email = mysql.escape(request.body.email);
                var password = mysql.escape(request.body.password).replaceAll("'", "");
                bcrypt.hash(password, 13, function(err, hash) 
                {
                    if(err) throw err;
                    user.createUserAccount(config.configEmail, username, email, hash, function (state)
                    {
                        if(!state) 
                        {
                            console.log("[!] Erreur lors de l'insertion d'un nouvel utilisateur dans la table 'users' de la base de données.");
                            var f = form.form("/register", config.configForms["register"], "Valider");
                            response.render(config.configRoutes["register"], { userDatas : request.session.userDatas, registerForm : f.print(), navBarContent : config.configNavBars, errors : ["Le pseudonyme choisi est déjà utilisé par un utilisateur, veuillez en choisir un autre."] });
                        }
                        else 
                        {
                            response.render(config.configRoutes["index"], { userDatas : request.session.userDatas, welcomeMessage : config.configStaticMessages["welcomeActivation"], navBarContent : config.configNavBars });
                        }
                    });
                });
            }
            else 
            {
                var f = form.form("/register", config.configForms["register"], "Valider");
                response.render(config.configRoutes["register"], { userDatas : request.session.userDatas, registerForm : f.print(), navBarContent : config.configNavBars, errors : formErrors });
            }
        }
        else if(request.url === "/messenger")
        {
            if(request.session.userDatas)
            {
                if(request.body.username)
                {
                    if(request.body.username.match(config.configInputRegex["loginSearch"]) !== null)
                    {
                        var usernameSearch = mysql.escape(request.body.username).replaceAll("'", "");
                        user.findUser(usernameSearch).then(async (matches) => 
                        {
                            response.render(config.configRoutes["messenger"], { discussions : [], navBarContent : config.configNavBars, userDatas : request.session.userDatas, searchResult : matches, fromid : await user.getUserID(request.session.userDatas["username"]) });
                        });
                    }
                    else 
                    {
                        response.send("<script>alert('Les termes de la recherche ne doivent contenir que des caractères alphanumériques, des tirets (-) ou des underscores (_).'); window.location.href='/messenger';</script>");
                    }
                }
            }
            else 
            {
                response.redirect("/login");
            }
        }
        else if(request.url == "/messenger/send/")   
        {
            if(request.session.userDatas)
            {
                discussion.discussionExists(request.body.fromUserID, request.body.toUserID).then((exists) => 
                {
                    if(exists === true)
                    {
                        var message = request.body.encryptedMessage;
                        var discussionID = request.body.discID;
                        var issuerID = mysql.escape(request.body.fromUserID).replaceAll("'", "");
                        var receiverID = mysql.escape(request.body.toUserID).replaceAll("'", "");
                        user.getUserID(request.session.userDatas["username"]).then((actualUserID) =>   
                        {
                            discussion.discussionExists(issuerID, receiverID).then((exists) => 
                            {
                                if(exists)
                                {
                                    if(actualUserID === parseInt(issuerID) || actualUserID === parseInt(receiverID))
                                    {
                                        discussion.addMessage(discussionID, message, function (state)
                                        {
                                            if(state)
                                            {
                                                console.log("Insertion d'un message dans la base de données.");
                                            }
                                        });
                                    }
                                }
                            })
                        });
                    }
                });
            }
        }
        else if(request.url == "/messenger/get/")
        {
            var discussionID = request.body.discID;
            var issuerID = mysql.escape(request.body.fromUserID).replaceAll("'", "");
            var receiverID = mysql.escape(request.body.toUserID).replaceAll("'", "");
            user.getUserID(request.session.userDatas["username"]).then( async (actualUserID) =>   
            {
                if(actualUserID === parseInt(issuerID) || actualUserID === parseInt(receiverID))
                {
                    var messages = await discussion.getDiscussionMessages(discussionID);
                    response.send(messages);
                }
            });
        }
        else if(request.url === "/login") 
        {
            var username = mysql.escape(request.body.username).replaceAll("'", "");
            var password = request.body.password;
            user.checkPassword(bcrypt, username, password, function (res)
            {
                if(res === true)
                {
                    user.isActive(username, function (state)
                    {
                        if(state)
                        {
                            user.getUserID(username).then((id) => 
                            {
                                user.createUserSession(username, request.ip).then((userData) =>
                                {
                                    request.session.userDatas = userData;
                                    user.getUserLoggedIPS(id).then((ips) => 
                                    {
                                        request.session.userDatas["ips"] = ips;
                                        user.logUserIP(request.ip, id);
                                        response.redirect("/member");
                                    });
                                });
                            });
                        }
                        else 
                        {
                            var f = form.form("/login", config.configForms["login"], "Connexion");
                            response.render(config.configRoutes["login"], { userDatas : request.session.userDatas, loginForm : f.print(), navBarContent : config.configNavBars, errors : ["Votre compte n'est pas activé, rendez-vous sur votre boite mail et suivez les instructions."] });
                        }
                    });
                }
                else 
                {
                    var f = form.form("/login", config.configForms["login"], "Connexion");
                    response.render(config.configRoutes["login"], { userDatas : request.session.userDatas, loginForm : f.print(), navBarContent : config.configNavBars, errors : ["Nom d'utilisateur ou mot de passe incorrect."] });     
                }
            });   
        }
        else if(request.url === "/member")
        {
            if(request.session.userDatas)
            {
                if(request.body.username)
                {
                    var username = mysql.escape(request.body.username).replaceAll("'", ""); 
                    var password = request.body.password;
                    var errors = user.checkRegisterForm(config.configInputRegex, username, "user@nomade.fr", "123456", "123456");
                    if(errors.length === 0)
                    {
                        user.checkPassword(bcrypt, request.session.userDatas["username"], password, function (res)
                        {
                            if(res === true)
                            {
                                user.changeUsername(request.session.userDatas["username"], username, function (state)
                                {
                                    if(state)
                                    {
                                        request.session.userDatas["username"] = username;
                                        response.send("<script>alert('Votre nom d\\'utilisateur a bien été changé.'); window.location.href='/member'</script>");
                                    }
                                    else 
                                    {
                                        response.send("<script>alert('Ce nom d\\'utilisateur n\\'est pas disponible, veuillez en choisir un autre.'); window.location.href='/member'</script>");
                                    }
                                });
                            }
                            else 
                            {
                                response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                            }
                        });
                    }
                    else 
                    {
                        response.send("<script>alert('" + errors[0].replaceAll("'", "\\'").replace("<br>", "") + "'); window.location.href='/member'</script>");
                    }
                }
                else if(request.body.new_email)
                {
                    var newEmail = mysql.escape(request.body.new_email).replaceAll("'", "");
                    var newEmailConfirm = mysql.escape(request.body.new_email_confirm).replaceAll("'", "");
                    var password = mysql.escape(request.body.password).replaceAll("'", "");
                    var errors = user.checkRegisterForm(config.configInputRegex, "root", newEmail, "123456", "123456");
                    if(errors.length === 0)
                    {
                        if(newEmail === newEmailConfirm)
                        {
                            user.checkPassword(bcrypt, request.session.userDatas["username"], password, function (res)
                            {
                                if(res === true)
                                {
                                    user.changeUserEmail(config.configEmail, request.session.userDatas["username"], newEmail).then((state) => 
                                    {
                                        if(state)
                                        {
                                            request.session.destroy();
                                            response.render(config.configRoutes["index"], { userDatas : [], welcomeMessage : config.configStaticMessages["welcomeActivation"], navBarContent : config.configNavBars });
                                        }
                                        else 
                                        {
                                            response.send("<script>alert('Une erreur inattendue s\\'est produite, veuillez réessayer.'); window.location.href='/member'</script>");
                                        }
                                    });
                                }
                                else 
                                {
                                    response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                                }
                            });
                        }
                        else 
                        {
                            response.send("<script>alert('Les deux addresses saisies ne sont pas identiques.'); window.location.href='/member'</script>");
                        }
                    }
                    else 
                    {
                        response.send("<script>alert('" + errors[0].replaceAll("'", "\\'").replace("<br>", "") + "'); window.location.href='/member'</script>");
                    }
                }
                else if(request.body.current_password)
                {
                    var currentPassword = mysql.escape(request.body.current_password).replaceAll("'", "");
                    var newPassword = mysql.escape(request.body.new_password).replaceAll("'", "");
                    var newPasswordConfirm = mysql.escape(request.body.new_password_confirm).replaceAll("'", "");
                    var errors = user.checkRegisterForm(config.configInputRegex, "root", "test@example.com", newPassword, newPasswordConfirm);
                    if(errors.length === 0)
                    {
                        user.checkPassword(bcrypt, request.session.userDatas["username"], currentPassword, function (res)
                        {
                            if(res === true)
                            {
                                user.changeUserPassword(bcrypt, request.session.userDatas["username"], newPassword).then((state) => 
                                {
                                    if(state)
                                    {
                                        response.send("<script>alert('Votre mot de passe a bien été changé.'); window.location.href='/member'</script>");
                                    }
                                    else 
                                    {
                                        response.send("<script>alert('Une erreur inattendue s'est produite, veuillez réessayer.'); window.location.href='/member'</script>");
                                    }
                                });
                            }
                            else 
                            {
                                response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                            }
                        });
                    }
                    else 
                    {
                        var eString = "";
                        for(var i = 0; i < errors.length; i++)
                        {
                            eString += errors[i];
                        }
                        response.send("<script>alert('" + eString + "'); window.location.href='/member'</script>");
                    }
                }
                else if(request.body.description)
                {
                    if(request.body.description.match(config.configInputRegex["description"]) !== null)
                    {
                        var description = mysql.escape(request.body.description).replaceAll("'", "");
                        var password = mysql.escape(request.body.password).replaceAll("'", "");
                        user.checkPassword(bcrypt, request.session.userDatas["username"], password, function (res)
                        {
                            if(res === true)
                            {
                                user.changeUserDescription(request.session.userDatas["username"], description).then((state) => 
                                {
                                    if(state)
                                    {
                                        request.session.userDatas["profile_description"] = description;
                                        response.send("<script>alert('Votre description a bien été mise à jour.'); window.location.href='/member'</script>");
                                    }
                                    else 
                                    {
                                        response.send("<script>alert('Une erreur inattendue s'est produite, veuillez réessayer.'); window.location.href='/member'</script>");
                                    }
                                });
                                
                            }
                            else 
                            {
                                response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                            }
                        });
                    }
                    else 
                    {
                        response.send("<script>alert('La description doit uniquement contenir des caractères alphanumériques, des tirets ou underscores, et sa taille doit être comprise entre 0 et 255 caractères, veuillez réessayer.'); window.location.href='/member'</script>");
                    }
                }
                else if(request.file)
                {
                    var password = mysql.escape(request.body.password).replaceAll("'", "");
                    user.checkPassword(bcrypt, request.session.userDatas["username"], password, async function (res)
                    {
                        if(res === true)
                        {
                            user.setUserAvatar(request.session.userDatas["username"], request.file.filename).then((state) => 
                            {
                                if(state)
                                {
                                    request.session.userDatas["avatar_path"] = request.file.filename;
                                    sharp("./public/uploads/" + request.session.userDatas["avatar_path"]).resize(128, 128).toBuffer().then
                                    (
                                        (
                                            buffer => 
                                            {
                                                fs.writeFile("./public/uploads/" + request.session.userDatas["avatar_path"], buffer, function (err)
                                                {
                                                    if(err) throw err;
                                                    response.send("<script>alert('Avatar modifié.'); window.location.href='/member'</script>"); 
                                                });
                                            }
                                        )
                                    );      
                                }
                                else 
                                {
                                    response.send("<script>alert('Une erreur inattendue s\\'est produite, veuillez réessayer. Si le problème persiste, contactez l\\'équipe du support.'); window.location.href='/member'</script>");
                                }
                            });
                        }
                        else 
                        {
                            response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                        }
                    });
                }
                else if(request.body.password_remove)
                {
                    var password = mysql.escape(request.body.password_remove).replaceAll("'", "");
                    user.checkPassword(bcrypt, request.session.userDatas["username"], password, async function (res)
                    {
                        if(res === true)
                        {
                            user.deleteUserAccount(request.session.userDatas["username"]).then((state) => 
                            {
                                if(state)
                                {
                                    response.send("<script>alert('Votre compte a bien été supprimé.'); window.location.href='/logout'</script>");
                                }
                            });
                        }
                        else 
                        {
                            response.send("<script>alert('Mot de passe incorrect, veuillez réessayer.'); window.location.href='/member'</script>");
                        }
                    });
                }
            }
            else 
            {
                response.redirect("/login");
            }
        }
    }
}
webApp.listen(config.configWebApp["port"], function (err)
{
    if(err) throw err;
    console.log("[*] Démarrage du serveur sur le port " + config.configWebApp["port"]);
    main();
});