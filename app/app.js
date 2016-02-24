var browser = (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

addLoadEvent(function() {
    outdatedBrowser({
        bgColor: '#f25648',
        color: '#ffffff',
        lowerThan: 'transform',
        languagePath: 'your_path/outdatedbrowser/lang/en.html'
    });
});

(function (){
        var app = document.querySelector('#app');
        var IDLE_TIMEOUT = 300; //seconds (5min-300sec)
        var _idleSecondsCounter = 0;
        var resizeTimer = null;

        // Sets app default base URL and globals
        app.properties = {
            route: {
                type: Object
            },
            dashboardCharts: {
                type: Array,
                value: function(){
                    return [];
                }
            },
            appColor: {
                type: String
            },
            theme: {
                type: String
            }
        };

        app.observers = [
            '_routeNameChanged(route)',
            '_classificationChanged(selectedClassification.*)',
            '_appColorChanged(appColor)',
            '_rememberMeChanged(rememberMe)',
            '_showEditChanged(showEdit)',
            '_themeChanged(theme)',
            '_tabWidthChanged(tabWidthScreen)'
        ];

        app.baseUrl = '/';
        app.apiUrl = 'http://fundamentalwebportal.azurewebsites.net/WebPortalService.svc/';
        app.sessionId = localStorage.getItem(app.apiUrl + 'session_id');
        app.rememberMe = localStorage.getItem(app.apiUrl + 'remember_me');
        app.IE = browser.indexOf('IE') > -1;
        app.isMobile = detectmob();
        app.openAnimationConfig = [
            {name: 'fade-in-animation', timing: {delay: 100, duration: 200}},
            {name: 'paper-menu-grow-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}}
        ];

        app.addClass = function(variable, classString){
            if(variable){
                return classString;
            }
        };

        app.toggleClass = function(variable, class1, class2){
            return variable ? class1 : class2;
        };

        app._routeNameChanged = function(route){
            setTimeout(function(){
                //console.log('route change callback');
                switch (route.name) {
                    case 'dashboard':
                        if(!app.appColor){
                            app.appColor = localStorage.getItem(app.apiUrl+ 'app_colour');
                        }
                        addDashboardChartsList();
                        break;
                    case 'login':
                        updateColors('paper-dialog', ['--paper-dialog-button-color'], ['#DD1F29']);
                        break;
                    case 'portfolio':
                        if(app.tabWidthScreen){
                            openFirstRows('.portfolio-table');
                        }
                        break;
                    case 'settings':
                        app.settingsTab = route.params.tab;
                        if(app.tabWidthScreen){
                            openFirstRows('.users-table');
                        }
                        app.listenForLogoChange();
                        break;
                    case 'signup':
                        app.sessionId ? page('/login') : null;
                        break;
                    case 'forgotpass':
                        app.sessionId ? page('/login') : null;
                        break;
                    case 'confirm':
                        app.sessionId ? page('/login') : null;
                        break;
                }

                if(route.name.indexOf('portfolio-item') > -1 && route.params.id){
                    app.portfolioTab = route.params.tab;
                    updateColors('jv-datepicker', ['--jv-datepicker-button-color', '--jv-datepicker-selected-year-color',
                            '--jv-datepicker-today-color', '--jv-datepicker-selected-day-bg', '--jv-datepicker-selection-bg'],
                        [app.appColor]);
                    if(route.params.tab == 'dashboard'){
                        addPortfolioChartsList(route.params.id);
                    } else {
                        var items = app.portfolioItems;
                        var id = route.params.id;
                        app.selectedClassification = items[id] && items[id].classifications ? items[id].classifications[0] : null;
                    }
                }

                app.showEdit = false;
                app.cleanSearch();
            });
        };

        app._appColorChanged = function(newVal){
            //This function update all custom styles for every element which need to be main color
            if(newVal){
                //console.log('app color changed to ' +newVal);
                var colorsStyle = document.querySelectorAll('style[is="custom-style"]')[0];
                colorsStyle.customStyle['--main-color'] = newVal;
                Polymer.updateStyles();

                updateColors('paper-checkbox', ['--paper-checkbox-checked-color', '--paper-checkbox-checked-ink-color'], [newVal]);
                updateColors('paper-radio-button', ['--paper-radio-button-checked-color', '--paper-radio-button-checked-ink-color'], [newVal]);
                updateColors('paper-input', ['--paper-input-container-focus-color'], [newVal]);
                updateColors('paper-dialog paper-input', ['--paper-input-container-focus-color'], [newVal]);
                updateColors('paper-toggle-button', ['--paper-toggle-button-checked-bar-color', '--paper-toggle-button-checked-button-color', '--paper-toggle-button-checked-ink-color'], [newVal]);
                updateColors('paper-input.color-selector', ['--paper-input-container-input'], ['color:'+newVal + ';font-size: 18px;text-transform: uppercase;']);
                updateColors('paper-color-picker', ['--default-primary-color', '--paper-button','--paper-input-container-focus-color'], [newVal, 'color:'+newVal, newVal]);
                updateColors('paper-dialog', ['--paper-dialog-button-color'], [newVal]);
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
                    logOut();
                    showAlert(null, 'Time expired!');
                }
            }
        }

        window.addEventListener('resize', function(){
            if(resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function() {
                var sections = document.querySelectorAll('section[data-route]');

                for(var i=0; i < sections.length; i++){
                    var section = sections[i];
                    if(section.classList.contains('iron-selected')){
                        if(app.route.name.indexOf('dashboard') > -1 || (app.route.name.indexOf('portfolio-item') > -1 && app.route.params.tab == 'dashboard')) {
                            var chartsList = section.querySelectorAll('charts-list')[0];
                            chartsList.buildCharts();
                        }
                        if(app.route.name.indexOf('portfolio-item') > -1 && app.route.params.tab == 'holdings'){
                            clearCharts(section);
                        }
                    } else {
                        clearCharts(section);
                    }
                }

                function clearCharts(section){
                    var chartsList = section.querySelectorAll('charts-list')[0];
                    chartsList ? chartsList.set('charts', []) : null;
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

        app.hideDragAndDrop = function(ie, mobile){
            return ie || mobile;
        };

        window.addEventListener('WebComponentsReady', function (e) {
            //console.log('WebComponentsReady');
            app.appColor = app.sessionId ? localStorage.getItem(app.apiUrl+ 'app_colour') : null;
        });

        //app.addEventListener('dom-change', function() {console.log('dom-change' );});
        //window.onload = function(){console.log('window load' );};
        //app.ready = function(){};
        //document.addEventListener('DOMContentLoaded', function(){console.log('DOMContentLoaded' );});
    })();
//}

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

    alertHeader.innerHTML = header ? header : '';
    alertText.innerHTML = text ? text : '';
    drawer ? drawer.closeDrawer() : null;
    alert.open();

    return alert.addEventListener('iron-overlay-closed', function(){
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

    return confirm.addEventListener('iron-overlay-closed', function(){
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

function updateColors(selector, properties, values){
    setTimeout(function(){
        var main = selector.indexOf('paper-dialog') > -1 || selector == 'paper-color-picker' ? document : document.querySelector('#paperDrawerPanel');
        var elements = main.querySelectorAll(selector);

        for(var i=0; i < elements.length; i++){
            var currentElement = elements[i];
            for(var j = 0; j < properties.length; j++){
                if(!currentElement.customStyle){
                    var colorsStyle = document.createElement('style', 'custom-style');
                    currentElement.appendChild(colorsStyle);
                    currentElement.customStyle[properties[j]] = values.length > 1 ? values[j] : values[0];
                    currentElement.updateStyles();
                } else {
                    currentElement.customStyle[properties[j]] = values.length > 1 ? values[j] : values[0];
                    currentElement.updateStyles();
                }
            }
        }
    });
}


function cleanForm(wrapper, value){
    setTimeout(function(){
        var form = document.querySelectorAll(wrapper)[0];
        var fields =  form.querySelectorAll('paper-input');

        for(var i = 0; i < fields.length; i++){
            fields[i].invalid ? fields[i].invalid = false : null;
            value ? fields[i].value = null : null;
        }
    });
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function detectmob() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}
