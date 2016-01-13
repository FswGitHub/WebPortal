(function (){
    var app = document.querySelector('#app');
    var request = document.getElementById('request');
    var dialog = document.getElementById('dialog');

    // Sets app default base URL and globals
    app.baseUrl = '/';
    app.apiUrl = 'http://fundamentalwebportal.azurewebsites.net/WebPortalService.svc/';
    app.mainColor = 'green';
    app.sessionId = localStorage.getItem('sessionId');

    app.addClass = function(variable, classString){
        if(variable){
            return classString;
        }
    };

    app.handleResponse = function(data){
        console.log(data);
    };

    app.dialogClose = function(){};

    app.dialogDismissText = function(confirm){
        if(confirm){
            return 'Cancel';
        } else {
            return 'OK';
        }

    };

    app.dialogConfirmed = function(){
        app.dialog.confirmed = true;
    };

    window.addEventListener('WebComponentsReady', function (e) {
         //if (app.mainColor) {
             //app.customStyle['--paper-input-container-focus-color'] = app.mainColor;
             //app.updateStyles();
         //}
     });
    //if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        //app.baseUrl = '/Fundamental v.2/';
    //}
})();
