(function (){
    var app = document.querySelector('#app');
    var IDLE_TIMEOUT = 300; //seconds (5min-300sec)
    var _idleSecondsCounter = 0;

    // Sets app default base URL and globals
    app.properties = {
        route: {
            type: Object,
            value: {}
        },
        dashboardCharts: {
            type: Array,
            value: []
        },
        mainColor: {
            type: Object,
            value: {red: undefined, green: undefined, blue: undefined, alpha: undefined}
        }
    };
    app.observers = [
        '_mainColorChanged(mainColor.*)'
    ];

    app.baseUrl = '/';
    app.apiUrl = 'http://fundamentalwebportal.azurewebsites.net/WebPortalService.svc/';
    app.sessionId = localStorage.getItem(app.apiUrl + 'session_id');
    app.mainColor = {red: 221, green: 31, blue: 41};

    app.addClass = function(variable, classString){
        if(variable){
            return classString;
        }
    };

    //Session timeout(5 minutes))
    document.onclick = function() {_idleSecondsCounter = 0;};
    document.onmousemove = function() {_idleSecondsCounter = 0;};
    document.onkeypress = function() {_idleSecondsCounter = 0;};
    window.setInterval(CheckIdleTime, 1000);

    function CheckIdleTime() {
        if (app.sessionId) {
            _idleSecondsCounter++;
            if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                app.sessionId = null;
                localStorage.clear();
                page('/login');
                showAlert(null, 'Time expired!');
            }
        }
    }

    window.onload = function() {
        //open first tables rows for mobile and tab screens
        openFirstRows();
    };

    //app.addEventListener('dom-change', function() {});
    //window.addEventListener('WebComponentsReady', function (e) {});
})();

function sendRequest(url, method, body, callback){
    var requester = document.createElement('iron-ajax');
    requester.url = url;
    requester.method = method;
    requester.body = JSON.stringify(body);
    document.body.appendChild(requester);
    requester.generateRequest();

    requester.addEventListener('response', function(e){
        requester.parentNode.removeChild(requester);
        callback.call(this, e);
    });
    requester.addEventListener('error', function(e){
        e.detail.url = url;
        requester.parentNode.removeChild(requester);
        return callback.call(this, e);
    });
}

function sendMultipleRequest(data, callback){
    var response = [];
    var requests = data;

    for(var i = 0; i < data.length; i++){
        sendRequest(data[i].url, data[i].method, data[i].body || null, function(e){
            response.push({
                data: e.detail.response ? e.detail.response : {},
                url: e.detail.url
            });

            if(response.length == requests.length){
                for(var j = 0; j < response.length; j++){
                    for(var k = 0; k < requests.length; k++){
                        if(requests[k].url == response[j].url){
                            requests[k] = response[j].data;
                        }
                    }
                }
                return callback.call(this, requests);
            }
        });
    }
}

function showAlert(header, text, callback){
    var alert = document.querySelector('#alertDialog');
    var alertHeader = alert.querySelector('#alertHeader');
    var alertText = alert.querySelector('#alertText');
    var drawer = document.getElementById('paperDrawerPanel');

    alertHeader.innerHTML = header ? header : null;
    alertText.innerHTML = text ? text : null;
    drawer ? drawer.closeDrawer() : null;
    alert.open();

    alert.addEventListener('iron-overlay-closed', function(){
        return callback ? callback.call() : null;
    });
}

function showConfirm(header, text, confirmCallback, closeCallback){
    var confirm = document.querySelector('#confirmDialog');
    var confirmButton = confirm.querySelector('#confirmButton');
    var confirmHeader = confirm.querySelector('#confirmHeader');
    var confirmText = confirm.querySelector('#confirmText');
    var drawer = document.getElementById('paperDrawerPanel');
    var confirmed;

    confirmHeader.innerHTML = header ? header : null;
    confirmText.innerHTML = text ? text : null;
    drawer ? drawer.closeDrawer() : null;
    confirm.open();

    confirmButton.addEventListener('tap', function(){
        confirmed = true;
    });

    confirm.addEventListener('iron-overlay-closed', function(){
        if(confirmed){
            confirmed = false;
            return confirmCallback ? confirmCallback.call() : null;
        } else {
            return closeCallback ? closeCallback.call() : null;
        }
    });
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
