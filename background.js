//--------------------------
console.log("Unloading.");
console.log(new Date());
//--------------------------

chrome.runtime.onInstalled.addListener(function() {
    // window.open('https://www.linkedin.com/in/tiago-fran%C3%A7a/');
    var target_url = encodeURI('https://tiagofranca.com/ref?title=Chrome Extension Laravel Docs Pinned Anchor Menu');
    window.open(target_url);

    function bg_returnBool(bool_value)
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

    chrome.storage.sync.get(['enable_menu_scroll'], function(result) {
        if((typeof(result.enable_menu_scroll) !== "undefined"))
        {
            localStorage.enable_menu_scroll = (typeof(bg_returnBool(result.enable_menu_scroll)) !== "undefined") && (typeof(bg_returnBool(result.enable_menu_scroll)) == "boolean")
                                                ? bg_returnBool(result.enable_menu_scroll) : true;
        }else{
            chrome.storage.sync.set({enable_menu_scroll: true}, function() {});
        }
    });
});