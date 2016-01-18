(function (){
    app.theme =  app.sessionId ? localStorage.getItem(app.apiUrl + 'theme') : 'dark';
    app.logo = app.sessionId ? localStorage.getItem(app.apiUrl + 'logo') : 'assets/images/logo-light.png';
    app.menuSubItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl +'portfolio_items')) : null;

    app.limitTo = function(items, numb){
        if(!items){
            return null;
        } else if(!numb){
            return items;
        } else {
            var limited = [];
            for(var i = 0; i< items.length; i++){
                if(limited.length < numb){
                    limited.push(items[i]);
                }
            }
            return limited;
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
})();

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

function getMenuData(apiUrl, sessionId){
    var url = apiUrl + 'resources/json/sidemenu.json/' + sessionId;
    sendRequest(url, 'GET', null, function(response){
        return response;
    });
}
