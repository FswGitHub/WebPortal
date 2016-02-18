(function () {
    app.dashboardCharts = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl +'dashboard_charts')) : null;
    app.addChart = function(e){
        var type = e.target.getAttribute('data-type');
        var chartList = document.getElementById('chartsList');
        chartList.addChart(type);
    };
})();

function addDashboardChartsList(){
    //setTimeout(function(){
        var dashboard = document.getElementsByClassName('dashboard-page-wrapper')[0];
        var chartsList = dashboard.getElementsByTagName('charts-list')[0];

        if(chartsList && app.dashboardCharts && app.dashboardCharts.length && !chartsList.charts.length){
            chartsList.set('charts', app.dashboardCharts);

            return setTimeout(function(){
                chartsList.buildCharts();
            });
        }
    //});
}
