(function (){
    app.userData = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'user')) : null;
    app.userData.photo = app.userData.photo ? 'assets/' + app.userData.photo : 'assets/images/icon-profile.png';
    app.showEdit = false;

    app.toggleProfileChanging = function(){
        return app.showEdit = !app.showEdit;
    }
})();
