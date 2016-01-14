function dashboardController(){
    //console.log('dashboard controller');
    app.dashboardCharts = app.sessionId ? localStorage.getItem(app.apiUrl +'dashboard/charts') : null;
    app.openAnimationConfig = [
        {name: 'fade-in-animation', timing: {delay: 100, duration: 200}},
        //{name: 'paper-menu-grow-width-animation', timing: {duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}},
        {name: 'paper-menu-grow-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}}
        //{name: 'paper-menu-shrink-width-animation', timing:{duration: 3000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
        //{name: 'paper-menu-shrink-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
    ];

    app.getChartsData = function(){
        app.method = 'GET';
        app.url = app.apiUrl + 'resources/json/charts.json/' + app.sessionId;
        app.handleResponse = app.chartsResponse;
        request.generateRequest();
    };

    app.chartsResponse = function(e, details){
        if(details.response.success){
            console.log(details.response);
            localStorage.setItem(app.apiUrl+ 'dashboard/charts', JSON.stringify(details.response.content));
            return details.response.content;
        } else {
            return null;
        }
    };
}
