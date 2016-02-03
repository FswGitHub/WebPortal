(function () {
    app.dashboardCharts = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl +'dashboard_charts')) : null;
    app.openAnimationConfig = [
        {name: 'fade-in-animation', timing: {delay: 100, duration: 200}},
        //{name: 'paper-menu-grow-width-animation', timing: {duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}},
        {name: 'paper-menu-grow-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}}
        //{name: 'paper-menu-shrink-width-animation', timing:{duration: 3000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
        //{name: 'paper-menu-shrink-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
    ];
    app.addChart = function(e){
        var type = e.target.getAttribute('data-type');
        var chartList = document.getElementById('chartsList');
        chartList.addChart(type);
    };

    app.addDashboardChartsList = function(){
        setTimeout(function(){
            var dashboard = document.getElementsByClassName('dashboard-page-wrapper')[0];
            var oldChartsList = dashboard.getElementsByTagName('charts-list')[0];
            var chartsList = document.createElement('charts-list');

            if(!oldChartsList){
                dashboard.appendChild(chartsList);
                chartsList.charts = app.dashboardCharts;
                return chartsList.buildCharts();
            }
        });
    };
})();
