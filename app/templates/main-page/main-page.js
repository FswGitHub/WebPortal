(function (){
    app.theme =  app.sessionId ? localStorage.getItem(app.apiUrl + 'theme') : 'dark';
    app.logo = app.sessionId ? localStorage.getItem(app.apiUrl + 'logo') : 'assets/images/logo-light.png';
    app.menuSubItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl +'portfolio_items')) : null;
    app.portfolioTab = 'dashboard';
    app.settingsTab = 'general';

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

    app.setMode = function(name){
        var portfolioItem = name.indexOf('portfolio-item') > -1;
        var settings = name.indexOf('settings') > -1;
        if(portfolioItem || settings){
            return portfolioItem ? 'tall' : 'medium-tall';
        } else {
            return null;
        }
    };

    app.tabGo = function(e){
        var item = e.currentTarget.getAttribute('data-tab');
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

    app.condensedHeaderValue = function(name){
        if(name.indexOf('portfolio-item') > -1){
            return 112;
        } else {
            return 56;
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
    showConfirm('Confirm','Are you sure you want to log out?', function(){
        app.sessionId = null;
        localStorage.clear();
        page('/login');
    });
};

function getMenuData(apiUrl, sessionId){
    var url = apiUrl + 'resources/json/sidemenu.json/' + sessionId;
    sendRequest(url, 'GET', null, function(response){
        return response;
    });
}
