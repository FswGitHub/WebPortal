(function (){
    app.theme =  app.sessionId ? localStorage.getItem('appTheme') : 'dark';
    app.logo = app.sessionId ? localStorage.getItem('appLogo') : 'assets/images/logo-light.png';
    app.menuSubItems = app.sessionId ? JSON.parse(localStorage.getItem('portfolioItems')) : null;

    app.getMenuSubItems = function(){
        app.method = 'GET';
        app.url = app.apiUrl + 'resources/json/sidemenu.json/' + app.sessionId;
        app.handleResponse = app.sideMenuResponse;
        request.generateRequest();
    };

    app.sideMenuResponse = function(event, details){
        if(details.response.success){
            app.menuSubItems = details.response.content;
            app.theme = details.response.theme;
            app.logo = 'assets/' + details.response.logo;
            localStorage.setItem('portfolioItems', JSON.stringify(app.menuSubItems));
            localStorage.setItem('appTheme', app.theme);
            localStorage.setItem('appLogo', app.logo);
        }
    };

    app.limitTo = function(numb){
        var output = [];
        if(!numb){
            return null;
        } else {
            return function(item) {
                if(output.length < numb){
                    output.push(item);
                    return output;
                }
            };
        }
    };

    app.showTabs = function(name, className){
        var tabs = name.indexOf('portfolio-item') == -1 && name.indexOf('settings') == -1;
        if(!tabs){
            return className;
        } else {
            return true;
        }
    };

    app.tabGo = function(e){
        var item = e.model.item;
        var state = app.route.params.id ? 'portfolio/'+ app.route.params.id + '/' : 'settings/';
        var path = '/'+state+item;
        page(path);
    };

    app.getTabName = function(name){
        if(name === 'configs'){
            return 'FPM configs';
        } else {
            return name;
        }
    };

    app.fixTabs = function(){
        var tabs = document.getElementsByTagName('paper-tabs')[0];
        tabs.notifyResize();
    };

    app.checkRoute = function(name, value){
        if(name.indexOf(value) > -1){
            return true;
        }
    };

    app.getAppTitle = function(route){
        if(route.name.indexOf('portfolio-item') > -1){
            if(app.menuSubItems){
                for(var i=0; i<app.menuSubItems.length; i++){
                    if(app.menuSubItems[i].id === route.params.id){
                        return app.menuSubItems[i].title;
                    }
                }
            }
        } else {
            return route.name;
        }
    };

    app.logout = function(){
        app.dialog = {
            confirm: true,
            header: 'Confirm',
            text: 'Are you sure you want to log out?'
        };

        app.dialogClose = function(){
            if(app.dialog.confirmed) {
                app.dialog.confirmed = false;
                app.sessionId = null;
                localStorage.clear();
                page('/login');
            } else {
                var drawer = document.getElementById('paperDrawerPanel');
                drawer.closeDrawer();
            }
            app.dialog.confirm = false;
        };
        dialog.open();
    };

    //Session timeout(5 minutes))
    var IDLE_TIMEOUT = 300; //seconds (5min-300sec)
    var _idleSecondsCounter = 0;
    document.onclick = function() {
        _idleSecondsCounter = 0;
    };
    document.onmousemove = function() {
        _idleSecondsCounter = 0;
    };
    document.onkeypress = function() {
        _idleSecondsCounter = 0;
    };
    window.setInterval(CheckIdleTime, 1000);

    function CheckIdleTime() {
        if (app.sessionId) {
            _idleSecondsCounter++;
            if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                app.dialog = {
                    header: '',
                    text: 'Time expired!'
                };
                app.dialogClose = function(){
                    app.sessionId = null;
                    localStorage.clear();
                    page('/login');
                };
                dialog.open();
            }
        }
    }
})();
