function gettypeof(element)
{
    return typeof element;
}

function returnBool(bool_value)
{
    if((typeof(bool_value) !== "undefined") && (typeof(bool_value) == "boolean"))
        return  bool_value;
    else
    {
        var booleans = ['true', 'false'];
        if(booleans.indexOf(bool_value) != -1)
        {
            if(bool_value == 'true')
            return true;

            if(bool_value == 'false')
            return false;
        }else
            return null;
    }    
}

function dump(log)
{
    return gettypeof(log)+' '+log;
}

chrome.storage.sync.get(['enable_menu_scroll'], function(result) {
    if((typeof(result.enable_menu_scroll) !== "undefined"))
    {
        localStorage.enable_menu_scroll = (typeof(returnBool(result.enable_menu_scroll)) !== "undefined") && (typeof(returnBool(result.enable_menu_scroll)) == "boolean")
                                            ? returnBool(result.enable_menu_scroll) : true;
    }else{
        chrome.storage.sync.set({enable_menu_scroll: true}, function() {});
    }
});

if (JSON.parse(localStorage.enable_menu_scroll)) {
    document.getElementById('enable_menu_scroll').checked   = true;
    localStorage.enable_menu_scroll                         = true;
} else {
    document.getElementById('enable_menu_scroll').checked   = false;
}

function updateExtensionOptions()
{
    var input_value = document.getElementById('enable_menu_scroll').checked;

    var new_value = (typeof(input_value) !== "undefined") && (typeof(input_value) == "boolean")
                    ? input_value : true;

    new_value = returnBool(new_value);
    
    chrome.storage.sync.set({enable_menu_scroll: new_value}, function() {});

    localStorage.enable_menu_scroll = new_value;

    document.getElementById('stored_enable_menu_scroll').innerHTML = JSON.parse(localStorage.enable_menu_scroll);
}

updateExtensionOptions();

document.getElementById('save').addEventListener('click', updateExtensionOptions);