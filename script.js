window.DEFAULT_MENU_SCROLL  = true;
window.enable_menu_scroll   = null;

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

function dump(log, console = false)
{
    if(console)
        console.log(gettypeof(log)+' '+log);
    else
        return gettypeof(log)+' '+log;
}

function updateLocalAndSyncStorageData()
{
    chrome.storage.sync.get(['enable_menu_scroll'], function(result) {
        if((result.enable_menu_scroll !== "undefined") && (typeof(result.enable_menu_scroll) == "boolean"))
        {
            localStorage.enable_menu_scroll = result.enable_menu_scroll;
            window.enable_menu_scroll       = result.enable_menu_scroll;
        }else{
            var _new_val                    = window.DEFAULT_MENU_SCROLL;
            localStorage.enable_menu_scroll = _new_val;
            window.enable_menu_scroll       = _new_val;
            
            chrome.storage.sync.set({enable_menu_scroll: _new_val}, function() {});
        }
    });
}

updateLocalAndSyncStorageData();

function enableMenu()
{
    var enable_menu_scroll_sets = JSON.parse(localStorage.enable_menu_scroll);

    if(returnBool(enable_menu_scroll_sets))
        return  enable_menu_scroll_sets;
    else
    {
        var booleans = ['true', 'false'];
        if(booleans.indexOf(enable_menu_scroll_sets) != -1)
        {
            if(enable_menu_scroll_sets == 'true')
            return true;

            if(enable_menu_scroll_sets == 'false')
            return false;
        }else
            return false;
    }
}

////////----------------------------------------------------------------------------------------------------
(function() {
    updateLocalAndSyncStorageData();

    /*
    section.docs_main>ul {
        left: 0;
        z-index: 1000;
        position: fixed;
        bottom: 0;
        top: 0;
        width: 28vw;
        border: 1px solid #ff2d20;
        background: #fff;
        overflow: scroll;
        width: 28%;
    }
    */
    
    var enable_menu_scroll = (typeof(window.enableMenu()) !== "undefined") && (typeof(window.enableMenu()) == "boolean")
                            ? window.enableMenu() : true;

    if(enable_menu_scroll)
    {
            var css = `.current_doc_menu{
  left: 0;
  z-index: 1000;
  position: fixed;
  bottom: 0;
  top: 0;
  width: 28vw;
  background: #fff;
  overflow: scroll;
  width: 28%;
}
.current_doc_menu .background_hash {background: #ff6347b0;padding: 2px;border-radius:2px;}

.current_doc_menu.hidden_on_menu{height: 33px; overflow: hidden; border: none;background: #0000;width: 0px;}

#button_menu_icon{
    display: unset;
    position: fixed;
    height: 33px;
    padding: 0px 9px 0px 3px;
    width: 40px;
    z-index: 1000;
}
.current_doc_menu li#button_menu_icon {
  margin-top: 0;
  background: white;
  border: 1px solid tomato;
  border-radius: 3px;
}
`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        var menu_button_html = `
        <button class="relative ml-1 w-6 h-6 text-red-600" aria-label="Menu" style="outline: none;">
            <svg class="absolute inset-0 w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" style="">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>`;

        var target_menu     = document.querySelectorAll('section.docs_main>ul');

        if(target_menu.length > 0)
        {
            if(document.querySelectorAll('header').length > 0 && document.querySelectorAll('#search_on_fixed_menu').length == 0)
            {
                var search_node         = document.querySelectorAll('header')[0].cloneNode(true);
                var li_el2              = document.createElement("li");
                li_el2.id               = "search_on_fixed_menu";
                // li_el2.style.display    = "none";
                li_el2.prepend(search_node);
                target_menu[0].prepend(li_el2);
            }

            if(document.querySelectorAll('#button_menu_icon').length == 0)
            {
                var li_el           = document.createElement("li");
                li_el.id            = "button_menu_icon";
                li_el.style.display = "none";
                li_el.innerHTML     = menu_button_html;
                target_menu[0].prepend(li_el);
            }
        }

        "scroll resize".split(" ").forEach(function(e){
                window.addEventListener(e,function(event) {

                var target_menu = document.querySelectorAll('section.docs_main>ul');
                if (target_menu.length > 0)
                {
                    var size_of_menu = target_menu[0].offsetHeight;
                    var top = this.scrollY;
                    var change_now = top > size_of_menu;

                    var body_width = document.querySelector('body').offsetWidth;

                    if(e == 'resize' && body_width < 1024)
                    {
                        target_menu[0].classList.remove('current_doc_menu');

                        if(document.querySelectorAll('li#button_menu_icon').length > 0)
                            document.querySelectorAll('li#button_menu_icon')[0].style.display = "none";
                    }

                    if (change_now && body_width >= 1024)
                    {
                        target_menu[0].classList.add('current_doc_menu');

                        if(document.querySelectorAll('li#button_menu_icon').length > 0)
                            document.querySelectorAll('li#button_menu_icon')[0].style.display = "unset";
                    }

                    if (this.scrollY <= 100)
                    {
                        target_menu[0].classList.remove('current_doc_menu');

                        if(document.querySelectorAll('li#button_menu_icon').length > 0)
                            document.querySelectorAll('li#button_menu_icon')[0].style.display = "none";
                    }
                }

            },false);
        });

        if(document.querySelectorAll('li#button_menu_icon').length > 0)
        {
            document.querySelectorAll('li#button_menu_icon')[0].addEventListener("click", function(event) {
                console.log('195');

                var target_menu = document.querySelectorAll('section.docs_main>ul');
                if (target_menu.length > 0)
                {
                    console.log('200');
                    
                    if(target_menu[0].classList.contains('hidden_on_menu'))
                    {
                        console.log('204');
                        target_menu[0].classList.remove('hidden_on_menu');
                    }
                    else{
                        console.log('208');
                        target_menu[0].classList.add('hidden_on_menu');
                    }
                }
            }, false);
        }


        window.addEventListener('hashchange', function() {
            var els = document.querySelectorAll('.background_hash').forEach(function(v, k){v.classList.remove('background_hash')});

            var el = document.querySelectorAll('.current_doc_menu li [href="'+document.location.hash+'"]');

            if(el.length > 0)
            {
                el[0].classList.add('background_hash');
            }

        }, false);
    }


}());