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

    app.logout = function(){
        app.dialog = {
            confirm: true,
            header: 'Confirm',
            text: 'Are you sure you want to log out?'
        };
        app.dialogClose = function(){
            if(app.dialog.confirmed){
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

        //console.log('main.page');
    };
})();
