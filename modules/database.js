var mysql = require("mysql");

module.exports = 
{
    database : function (config)
    {
        this.mysqlConfig = config;
        return this;
    },
    createConnection : function()
    {
        return mysql.createConnection
        (
            {
                host : this.mysqlConfig["host"],
                user : this.mysqlConfig["user"],
                password : this.mysqlConfig["password"],
                database : this.mysqlConfig["database"],
                charset : "utf8mb4"
            }
        );
    }
};