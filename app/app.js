(function (){
    var app = document.querySelector('#app');
    var IDLE_TIMEOUT = 300; //seconds (5min-300sec)
    var _idleSecondsCounter = 0;
    var resizeTimer = null;

    // Sets app default base URL and globals
    app.properties = {
        route: {
            type: Object,
            value: {
                params: {
                    type: Object,
                    value: {
                        id: {type: Number},
                        tab: {type: String}
                    }
                },
                name: {
                    type: String,
                    value: []
                }
            }
        },
        dashboardCharts: {
            type: Array,
            value: []
        },
        mainColor: {
            type: Object,
            value: {red: undefined, green: undefined, blue: undefined, alpha: undefined}
        }
        //holdingsData: {
        //    type: Array,
        //    computed: ''
        //}
    };

    app.observers = [
        '_routeNameChanged(route)',
        '_mainColorChanged(mainColor.*)',
        '_classificationChanged(selectedClassification.*)'
        //'_holdingsChanged(holdingsData)'
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

    app.toggleClass = function(variable, class1, class2){
        return variable ? class1 : class2;
    };

    app._routeNameChanged = function(route){
        switch (route.name) {
            case 'dashboard':
                app.addDashboardChartsList();
                break;
            case 'login':
                app.removeAllCharts();
                app.portfolioTab = null;
                app.settingsTab = null;
                break;
        }

        if(route.name.indexOf('portfolio-item') > -1 && route.params.id){
            if(route.params.tab == 'dashboard'){
                app.addPortfolioChartsList(route.params.id);
            } else {
                var items = app.portfolioItems;
                var id = route.params.id;
                app.selectedClassification = items[id] && items[id].classifications ? items[id].classifications[0] : null;
            }
        }
        app.cleanSearch();
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
        app.currentWidth = document.body.offsetWidth;
        app.currentHeight = document.body.offsetHeight;
    };

    window.addEventListener('resize', function(){
        if(resizeTimer) {
            clearTimeout(resizeTimer);
        }

        resizeTimer = setTimeout(function() {
            var currentSection = document.querySelectorAll('section[data-route].iron-selected')[0];

            if(currentSection &&  ((app.route.name == 'dashboard') || (app.route.params && app.route.params.tab == 'dashboard'))){
                var charts = currentSection.getElementsByTagName('chart-item');
                for(var i=0; i<charts.length; i++){
                    charts[i].setChart();
                }
            }
        }, 250);
    });

    // Scroll page to top and expand header

    app.scrollPageToTop = function(e) {
        var pages  = document.querySelector('iron-pages');
        var header = document.querySelector('#headerPanelMain');
        pages ? pages.scrollTop = 0 : null;
        header ? header.scrollToTop(true) : null;

    };

    app.closeDrawer = function() {
        var drawer = document.getElementById('paperDrawerPanel');
        drawer ? drawer.closeDrawer() : null;
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


function openFirstRows(){
    var tables = document.getElementsByClassName('data-table');
    setTimeout(function(){
        for(var i = 0; i < tables.length; i++) {
            var allRows = tables[i].getElementsByClassName('data-tbody-tr');
            var firstRow = allRows[0];
            firstRow ? firstRow.classList.remove('mobile-data-td') : null;
            for(var j=1; j < allRows.length; j++){
                if(!allRows[j].classList.contains('mobile-data-td')){
                    allRows[j].classList.add('mobile-data-td');
                }
            }
        }
    });
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
