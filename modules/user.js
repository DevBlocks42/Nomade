var crypto = require("crypto");
var mailer = require("../modules/mailer");
var mysql = require("mysql");
const { resolve } = require("path");

module.exports = 
{
    user : function (databaseConnection) 
    {
        this.databaseConnection = databaseConnection;
        return this;
    },
    createUserAccount : function (configEmail, username, email, password, callback) 
    {
        var random = crypto.randomBytes(60).toString();
        var activationHash = crypto.createHash("sha3-256").update(random).digest("hex");
        var sql = "INSERT INTO users (username, password_hash, email, activation_hash, last_login_date) VALUES (?, ?, ?, ?, ?)";
        var date = new Date();
        this.databaseConnection.query(sql, [username.replaceAll("'", ""), password, email.replaceAll("'", ""), activationHash, date], function (err, result)
        {
            if(err) throw err;
            if(result.affectedRows > 0)
            {
                console.log("[*] Insertion d'un nouvel utilisateur dans la table 'users' de la base de données.");
                var nodeMailer = mailer.mailer(configEmail);
                nodeMailer.sendMessage("Nomade - Activation", "Bienvenue sur <i>Nomade Secured Chat</i> <b>" + username.replaceAll("'", "") + "</b>, votre compte a bien été créé, cependant celui-ci nécéssite d'être activé. Pour ce faire, veuillez copier/coller ou cliquer sur <a href = 'http://192.168.0.26:8080/activation/" + activationHash + "'>ce lien</a>.", email.replaceAll("'", ""));
                callback(true);
            }
            else 
            {
                callback(false);
            }
        });
    },
    checkRegisterForm : function (configRegex, username, email, password, passwordConfirm)
    {
        var errors = [];
        if(username.match(configRegex["login"]) === null)
        {
            errors.push("Le nom d'utilisateur doit uniquement être composé de caractères alphanumériques et sa taille comprise entre 4 et 20 caractères.<br>");
        }
        if(email.match(configRegex["email"]) === null)
        {
            errors.push("Le format d'adresse email saisi semble incorrect, veuillez choisir une autre adresse.<br>");
        }
        if(password.match(configRegex["password"]) === null)
        {
            errors.push("La taille du mot de passe doit être comprise entre 6 et 32 caractères.");
        }
        if(password !== passwordConfirm)
        {
            errors.push("Les deux mots de passes saisis ne correspondent pas.");
        }
        return errors;
    },
    checkActivation : function(hash, callback) 
    {
        var sql = "SELECT activation_hash FROM users WHERE activation_hash = ?";
        this.databaseConnection.query(sql, [mysql.escape(hash).replaceAll("'", "")], function (err, result)
        {
            if(err) throw err;
            if(result.length > 0)
            {
                callback(true);   
            }
            else 
            {
                callback(false);
            }
        });
    },
    activateUser : function(hash, callback)
    {
        var sql = "UPDATE users SET is_active = 1 WHERE activation_hash = ?";
        this.databaseConnection.query(sql, [mysql.escape(hash).replaceAll("'", "")], function (err, result)
        {
            if(err) throw err;
            if(result.affectedRows > 0)
            {
                callback(true);
            }
            else 
            {
                callback(false);
            }
        });
    },
    checkPassword : function(bcrypt, username, password, callback)
    {
        var sql = "SELECT password_hash FROM users WHERE username = ?";
        this.databaseConnection.query(sql, [username], async function (err, result)
        {
            if(err) throw err;
            if(result.length > 0)
            {
                var match = await bcrypt.compare(password, result[0].password_hash);
                if(match)
                {
                    callback(true);
                }
                else 
                {
                    callback(false);
                }
            }
            else 
            {
                callback(false);
            }
        });
    },
    isActive : function(username, callback)
    {
        var sql = "SELECT is_active FROM users WHERE username = ?";
        this.databaseConnection.query(sql, [username], function (err, result)
        {
            if(err) throw err;
            if(result.length > 0)
            {
                if(result[0].is_active === 1)
                {
                    callback(true);
                }
                else 
                {
                    callback(false);
                }
            }
            else 
            {
                callback(false);
            }
        });
    },
    createUserSession : function(username, sessionIP)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "SELECT username, email, profile_description, last_login_date, avatar_path FROM users WHERE username = ?";
            this.databaseConnection.query(sql, [username], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    var userData = 
                    {
                        "username" : result[0].username,
                        "email" : result[0].email,
                        "profile_description" : result[0].profile_description,
                        "last_login_date" : result[0].last_login_date,
                        "avatar_path" : result[0].avatar_path,
                        "session_ip" : sessionIP,
                        "logged_ips" : ""
                    }
                    resolve(userData);
                }
            });
        });
    },
    getUserID : function(username)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "SELECT id FROM users WHERE username = ?";
            this.databaseConnection.query(sql, [username], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    resolve(result[0].id);
                }
            });
        });
    },
    getUserLoggedIPS : function(id)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "SELECT ip FROM addresses WHERE user_id = ?";
            this.databaseConnection.query(sql, [id], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    var ips = [];
                    for(var i = 0; i < result.length; i++)
                    {
                        ips.push(result[i].ip);
                    }
                    resolve(ips);
                }
                else 
                {
                    resolve([]);
                }
            });
        });
    },
    logUserIP : async function(ip, id)
    {
        return new Promise((resolve, reject) => 
        {
            var sql = "SELECT ip FROM addresses WHERE user_id = ?";
            this.databaseConnection.query(sql, [id], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    var exists = false;
                    for(var i = 0; i < result.length; i++)
                    {
                        if(result[i].ip.includes(ip))
                        {
                            exists = true;
                        }
                    }
                    if(!exists)
                    {
                        resolve(ip);
                    }
                }
                else 
                {
                    resolve(ip);
                }
            });
        }).then((ipToLog) =>
        {
            var sql = "INSERT INTO addresses (user_id, ip) VALUES(?, ?)";
            this.databaseConnection.query(sql, [id, ipToLog], function (err, result)
            {
                if(err) throw err;
            });
        });
    },
    changeUsername : function(username, newName, callback)
    {
        var sql = "UPDATE users SET username = ? WHERE username = ?";
        this.databaseConnection.query(sql, [newName, username], function (err, result)
        {
            if(err) throw err;
            if(result.affectedRows > 0)
            {
                callback(true);
            }
            else 
            {
                callback(false);
            }
        });
    },
    changeUserEmail : function(configEmail, username, email)
    {
        var random = crypto.randomBytes(60).toString();
        var activationHash = crypto.createHash("sha3-256").update(random).digest("hex");
        var sql = "UPDATE users SET email = ?, is_active = 0, activation_hash = ? WHERE username = ?";
        return new Promise((resolve, reject) =>
        {
            this.databaseConnection.query(sql, [email, activationHash, username], function (err, result)
            {
                if(err) reject();
                if(result.affectedRows > 0)
                {
                    var nodeMailer = mailer.mailer(configEmail);
                    nodeMailer.sendMessage("Nomade - Changement d'adresse email", "Bonjour <b>" + username + "</b>, votre adresse email a bien été changée, cependant celle-ci nécéssite d'être activée. Pour ce faire, veuillez copier/coller ou cliquer sur <a href = 'http://192.168.0.26:8080/activation/" + activationHash + "'>ce lien</a>.", email);
                    resolve(true);
                }
                else 
                {
                    resolve(false);
                }
            });
        });
    },
    changeUserPassword : function(bcrypt, username, newPassword)
    {
        var databaseConnection = this.databaseConnection;
        return new Promise((resolve, reject) =>
        {
            bcrypt.hash(newPassword, 13, function(err, hash) 
            {
                if(err) throw err;
                var sql = "UPDATE users SET password_hash = ? WHERE username = ?";
                databaseConnection.query(sql, [hash, username], function (err, result)
                {
                    if(err) reject();
                    if(result.affectedRows > 0)
                    {
                        resolve(true);
                    }
                    else 
                    {
                        resolve(false);
                    }
                });
            });
        });
    },
    changeUserDescription : function(username, description)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "UPDATE users SET profile_description = ? WHERE username = ?";
            this.databaseConnection.query(sql, [description, username], function (err, result)
            {
                if(err) throw err;
                if(result.affectedRows > 0)
                {
                    resolve(true);
                }
                else 
                {
                    resolve(false);
                }
            });
        });
    },
    setUserAvatar : function(username, filePath)
    {
        return new Promise((resolve, reject) => 
        {
            var sql = "UPDATE users SET avatar_path = ? WHERE username = ?";
            this.databaseConnection.query(sql, [filePath, username], function(err, result)
            {
                if(err) throw err;
                if(result.affectedRows > 0)
                {
                    resolve(true);
                }
                else 
                {
                    resolve(false);
                }
            });
        });
    },
    deleteUserAccount : function(username)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "DELETE FROM users WHERE username = ?";
            this.databaseConnection.query(sql, [username], function(err, result)
            {
                if(err) throw err;
                if(result.affectedRows > 0)
                {
                    resolve(true);
                }
                else 
                {
                    resolve(false);
                }
            });
        });
    },
    findUser : function(username)
    {
        return new Promise((resolve, reject) =>
        {
            var sql = "SELECT username, avatar_path, id FROM users WHERE username LIKE ?";
            this.databaseConnection.query(sql, ["%" + username + "%"], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    var resultArray = [];
                    for(var i = 0; i < result.length; i++)
                    {
                        resultArray.push([result[i].username, result[i].avatar_path, result[i].id]);
                    }
                    resolve(resultArray);
                }
                else 
                {
                    resolve([]);
                }
            });
        });
    },
    getUserPasswordHash : function(userid)
    {
        var uid = mysql.escape(userid).replaceAll("'", "");
        var sql = "SELECT password_hash FROM users WHERE id = ?";
        return new Promise((resolve, reject) =>
        {
            this.databaseConnection.query(sql, [uid], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    resolve(result[0].password_hash);
                }
                else 
                {
                    resolve("");
                }
            });
        });
    },
    getUserName : function (userid)
    {
        var uid = mysql.escape(userid).replaceAll("'", "");
        return new Promise((resolve, reject) => 
        {
            var sql = "SELECT username FROM users WHERE id = ?";
            this.databaseConnection.query(sql, [uid], function (err, result)
            {
                if(err) throw err;
                if(result.length > 0)
                {
                    resolve(result[0].username);
                }
                else 
                {
                    resolve("");
                }
            })
        });
    }
};