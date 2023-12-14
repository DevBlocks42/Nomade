var nodemailer = require("nodemailer");

module.exports = 
{
    mailer : function(config)
    {
        this.transporter = nodemailer.createTransport
        (
            {
                host : config["host"],
                port : config["port"],
                auth : 
                {
                    user : config["user"],
                    pass : config["pass"]
                }
            }
        );
        return this;
    },
    sendMessage : function(title, message, destination)
    {
        var headers = 
        {
            from : "Nomade Secured Chat",
            to : destination, 
            subject : title,
            html : message
        };
        this.transporter.sendMail(headers, function (err, info)
        {
            if(err) throw err;
            console.log(info.messageId);
        });
    }
};