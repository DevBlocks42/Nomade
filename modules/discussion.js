var mysql = require("mysql");
var openpgp = require("openpgp");

module.exports = 
{
    discussion : function(databaseConnection)
    {
        this.databaseConnection = databaseConnection;
        return this;
    },
    createDiscussion : function(user, fromID, toID, state)
    {
        var issuerID = mysql.escape(fromID).replaceAll("'", "");
        var receiverID = mysql.escape(toID).replaceAll("'", "");
        var date = new Date();
        return new Promise((resolve, reject) => 
        {
            var sql = "INSERT INTO discussions (from_user_id, to_user_id, creation_date, is_active) VALUES(?, ?, ?, ?)";
            this.databaseConnection.query(sql, [issuerID, receiverID, date, 1], async function (err, res)
            {
                if(err) throw err;
                if(res.affectedRows > 0) 
                {
                    var issuerHash = await user.getUserPasswordHash(issuerID); 
                    var receiverHash = await user.getUserPasswordHash(receiverID);
                    var issuerKeyPair = await openpgp.generateKey
                    ({
                        type : "ecc", 
                        curve : "curve25519", 
                        userIDs : {name : issuerID, email: issuerID + "@nomade.fr"},
                        passphrase : issuerHash,
                        format : "armored"
                    });
                    var receiverKeyPair = await openpgp.generateKey
                    ({
                        type : "ecc", 
                        curve : "curve25519", 
                        userIDs : {name : receiverID, email: receiverID + "@nomade.fr"},
                        passphrase : receiverHash,
                        format : "armored"
                    });
                    resolve([issuerKeyPair, receiverKeyPair, res.insertId]); 
                }
                else 
                {
                    resolve([]);
                }
            });
        }).then((keys) =>
        {
            if(keys.length > 0)
            {
                var sql = "INSERT INTO cipher_keys (discussion_id, user_id, public_key, private_key) VALUES(?, ?, ?, ?);";
                this.databaseConnection.query(sql, [keys[2], issuerID, keys[0]["publicKey"], keys[0]["privateKey"]], function (err, result)
                {
                    if(err) throw err;
                });
                this.databaseConnection.query(sql, [keys[2], receiverID, keys[1]["publicKey"], keys[1]["privateKey"]], function (err, result)
                {
                    if(err) throw err;
                    state(true);
                });
            }
        });
    },
    discussionExists : function(fromID, toID)
    {
        var issuerID = mysql.escape(fromID).replaceAll("'", "");
        var receiverID = mysql.escape(toID).replaceAll("'", "");
        var sql = "SELECT * FROM discussions WHERE from_user_id = ? AND to_user_id = ?;";
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [issuerID, receiverID], function(err, res)
            {
                if(err) throw err;
                if(res.length > 0)
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
    getDiscussionID : function(fromID, toID)
    {
        var issuerID = mysql.escape(fromID).replaceAll("'", "");
        var receiverID = mysql.escape(toID).replaceAll("'", "");
        var sql = "SELECT id FROM discussions WHERE from_user_id = ? AND to_user_id = ?";
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [issuerID, receiverID], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    resolve(res[0].id)
                }
                else 
                {
                    resolve(-1);
                }
            });
        });
    },
    getDiscussionCertificates : function(discussionID, issuerID, receiverID, callback)
    {
        var discID = mysql.escape(discussionID).replaceAll("'", "");
        var issuer = mysql.escape(issuerID).replaceAll("'", "");
        var receiver = mysql.escape(receiverID).replaceAll("'", "");
        var sql = "SELECT public_key FROM cipher_keys WHERE discussion_id = ? AND user_id = ?";
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [discID, receiver], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    resolve(res[0].public_key);
                }
                else 
                {
                    resolve("");
                }
            });
        }).then((receiverPublicKey) => 
        {
            var sql = "SELECT private_key FROM cipher_keys WHERE discussion_id = ? AND user_id = ?";
            this.databaseConnection.query(sql, [discID, issuer], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    callback([receiverPublicKey, res[0].private_key]);
                }
                else 
                {
                    callback("");
                } 
            });
        });
    },
    addMessage : function(discussionID, encryptedMessage, callback)
    {
        var sql = "INSERT INTO messages (discussion_id, sending_date, message_body) VALUES(?, ?, ?)";
        var discussionID = mysql.escape(discussionID).replaceAll("'", "");
        var encryptedMessage = mysql.escape(encryptedMessage).replaceAll("'", ""); 
        var date = new Date();
        this.databaseConnection.query(sql, [discussionID, date, encryptedMessage], function (err, res)
        {
            if(err) throw err;
            if(res.affectedRows > 0)
            {
                callback(true);
            }
            else 
            {
                callback(false);
            }
        });
    },
    getDiscussionMessages : function (discID)
    {
        var discussionID = mysql.escape(discID).replaceAll("'", "");
        var sql = "SELECT sending_date, message_body FROM messages WHERE discussion_id = ? ORDER BY sending_date ASC";
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [discussionID], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    resolve(res);
                }
                else 
                {
                    resolve([]);
                }
            });
        });
    },
    getUserPublicKey : function (discID, userID)
    {
        var sql = "SELECT public_key FROM cipher_keys WHERE user_id = ? AND discussion_id = ?";
        var dID = mysql.escape(discID).replaceAll("'", "");
        var uID = mysql.escape(userID).replaceAll("'", "");
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [uID, dID], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    resolve(res[0].public_key);
                }
                else 
                {
                    resolve();
                }
            });
        });
    },
    getUserDiscussions : function (userid)
    {
        var sql = "SELECT DISTINCT id FROM discussions WHERE from_user_id = ? OR to_user_id = ?";
        var uid = mysql.escape(userid).replaceAll("'", "");
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [uid, uid], function (err, res)
            {
                if(err) throw err;
                var ids = [];
                if(res.length > 0)
                {
                    for(var i = 0; i < res.length; i++)
                    {
                        ids.push(res[i].id);
                    }
                    resolve(ids);
                }
                else 
                { 
                    resolve(null);
                }
            });
        });
    },
    getDiscussionUserIDS : function(id)
    {
        var sql = "SELECT from_user_id, to_user_id FROM discussions WHERE id = ?";
        var id = mysql.escape(id).replaceAll("'", "");
        return new Promise((resolve, reject) => 
        {
            this.databaseConnection.query(sql, [id], function (err, res)
            {
                if(err) throw err;
                if(res.length > 0)
                {
                    resolve([res[0].from_user_id, res[0].to_user_id]);
                }
                else 
                {
                    resolve(null);
                }
            });
        });
    }
}