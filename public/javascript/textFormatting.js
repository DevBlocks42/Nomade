String.prototype.splice = function(idx, rem, str) 
{
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
function formatText(id)
{
    var inputField = document.getElementById("message");
    var selection = inputField.value.substring(inputField.selectionStart, inputField.selectionEnd);
    var val = inputField.value;
    val = val.replace(selection, "");
    switch(id)
    {
        case 0:
            selection = "<b>" + selection + "</b>";
            break;
        case 1:
            selection = "<i>" + selection + "</i>";
            break;
        case 2:
            selection = "<u>" + selection + "</u>";
            break;
        case 3:
            selection = "<s>" + selection + "</s>";
            break;
        default:
            break;
    }
    val = val.splice(inputField.selectionStart, 0, selection);
    inputField.value = val;
}