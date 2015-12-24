(function (){
    app.theme = localStorage.getItem('appTheme') || 'dark';
    app.logo = localStorage.getItem('appLogo') || 'assets/images/logo-light.png';
    app.menuSubItems = JSON.parse(localStorage.getItem('portfolioItems'));

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
        } else {
            app.menuSubItems = null;
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

    app.showToolbar = function(name){
        if(name.indexOf('portfolio-item') == -1 && name.indexOf('settings') == -1){
            return true;
        }
    };

    app.checkRoute = function(name, value){
        if(name.indexOf(value) > -1){
            return true;
        }
    };

    app.getAppTitle = function(route){
        if(route.params){
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
    var IDLE_TIMEOUT = 300; //seconds
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
