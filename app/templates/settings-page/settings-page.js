(function(){
    app.settings = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'settings')) : null;
    app.users = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'users')) : null;

    app._mainColorChanged = function(){
        //console.log(app.mainColor);
    };
})();
