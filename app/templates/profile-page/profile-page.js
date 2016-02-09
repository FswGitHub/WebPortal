(function (){
    app.userData = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'user')) : null;
    app.showEdit = false;

    app.setUserPhoto = function(photo){
        return photo ? 'assets/' + photo : 'assets/images/icon-profile.png';
    };

    app.toggleProfileChanging = function(){
        return app.showEdit = !app.showEdit;
    };

    window.addEventListener('WebComponentsReady', function () {
        //Upload new user profile image
        //
        //var uploader  = document.querySelector('#uploader');
        //
        //uploader.addEventListener('change', function(e){
        //
        //}, false);
    });

})();
