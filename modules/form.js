module.exports = 
{
    form : function (action, inputFields, submitValue)
    {
        this.action = action;
        this.inputFields = inputFields;
        this.submitValue = submitValue;
        return this;
    },
    print : function(files = false)
    {
        var htmlForm = "";
        if(!files)
        {
            htmlForm = "<form class = 'form' action = '" + this.action + "' method = 'POST'>";
        }
        else 
        {
            htmlForm = "<form class = 'form' action = '" + this.action + "' method = 'POST' enctype = 'multipart/form-data'>"; 
        }
        for(var i = 0; i < this.inputFields.length; i++)
        {
            htmlForm += "<label>" + this.inputFields[i][0] + "</label><input class = 'input' type = '" + this.inputFields[i][1]+ "' placeholder = '" + this.inputFields[i][2] + "' name = '" + this.inputFields[i][3]+ "'>";
        }
        htmlForm += "<input class = 'input mt-4' type = 'submit' value = '" + this.submitValue + "'></form>";
        return htmlForm;
    }
};