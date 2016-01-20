(function (){
    var app = document.querySelector('#app');
    var dialog = document.getElementById('dialog');
    var IDLE_TIMEOUT = 300; //seconds (5min-300sec)
    var _idleSecondsCounter = 0;

    // Sets app default base URL and globals
    app.properties = {
        route: {
            type: Object,
            value: {}
            //observer: '_routeChanged'
        },
        dashboardCharts: {
            type: Array,
            value: [],
            observer: '_dashboardChartsChanged'
        }
    };

    app.baseUrl = '/';
    app.apiUrl = 'http://fundamentalwebportal.azurewebsites.net/WebPortalService.svc/';
    app.sessionId = localStorage.getItem(app.apiUrl + 'session_id');

    app.addClass = function(variable, classString){
        if(variable){
            return classString;
        }
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
        //sendRequest(app.apiUrl + 'resources/json/login.json', 'POST', {email: app.login.signIn.email, password: app.login.signIn.pass}, function(e, detail){
        //    console.log(detail.response);
        //});
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

    //Session timeout(5 minutes))
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

function sendRequest(url, method, body, callback){
    var requester = document.createElement('iron-ajax');

    requester.url = url;
    requester.method = method;
    requester.body = JSON.stringify(body);
    requester.generateRequest();

    requester.addEventListener('response', function(e){
        callback.call(this, e.detail.response);
        requester.remove();
    });
}

function sendMultipleRequest(data, callback){
    var response = [];
    for(var i=0; i < data.length; i++){
        sendRequest(data[i].url, data[i].method, data[i].body || null,
            function(content){
                response.push(content);
                if( response.length == data.length){
                    callback.call(this, response);
                }
            });
    }
}
