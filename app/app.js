(function (){
    var app = document.querySelector('#app');

    // Sets app default base URL
    app.baseUrl = '/';
    app.apiUrl = 'http://fundamentalwebportal.azurewebsites.net/WebPortalService.svc/';
    app.mainColor = 'green';
    app.sessionId = localStorage.getItem('sessionId');

    app.addClass = function(variable, classString){
        if(variable){
            return classString
        }
    };

    app.handleResponse = function(data){
        console.log(data);
    };

    window.addEventListener('WebComponentsReady', function (e) {
         //if (app.mainColor) {
             //app.customStyle['--paper-input-container-focus-color'] = app.mainColor;
             //app.updateStyles();
         //}
     });

    window.onload = function (e) {
        //if spinner
    };

    //if (window.location.port === '') {  // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        //app.baseUrl = '/Fundamental v.2/';
    //}
})();