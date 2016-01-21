Polymer({
    is: 'charts-list',
    properties: {
        charts: {
            type: Array,
            value: new Array(4),
            observer: '_chartsChanged'
        },
        openAnimationConfig: {
            type: Object,
            value: {}
        },
        listLength: {
            type: Number,
            value: 4
        },
        options: {
            type: Object,
            value: {
                animation: false
            }
        }
    },
    ready: function () {
        this.openAnimationConfig = app.openAnimationConfig;

    },
    _chartsChanged: function(){
        var self = this;
        setTimeout(function(){
            if(self.charts.length < self.listLength){
                var difference = new Array(self.listLength - self.charts.length);
                self.charts.concat(difference);
            }
            return self.buildChartsList(self.charts);
        });
    },
    updateCharts: function(list){
        var chartsElements = list.getElementsByClassName('holding-chart');
        setTimeout(function(){
            for(var i=0; i< chartsElements.length; i++) {
                chartsElements[i].updateChart();
            }
        }, 0);
    },
    resizeCharts: function(){
        var charts = document.getElementsByClassName('holding-chart');
        setTimeout(function(){
            for(var i=0; i< charts.length; i++) {
                charts[i].resize();
            }
        }, 0);
    },
    buildChartsList: function(charts){
        var self = this;
        var elements = document.getElementsByClassName('chart-item-wrapper');

        setTimeout(function(){
            for(var i=0; i < elements.length; i++) {
                var oldChart = elements[i].getElementsByClassName('chart-item')[0];
                var empty = elements[i].classList.contains('empty');

                if(charts[i] && charts[i].data){
                    var type = charts[i].type || 'line';
                    var newChart = document.createElement('chart-'+type);
                    newChart.data = charts[i].data;
                    newChart.options = self.options;
                    newChart.className = 'chart-item holding-chart style-scope charts-list';
                    if(empty){
                        elements[i].appendChild(newChart);
                        elements[i].classList.remove('empty');
                    } else {
                        elements[i].removeChild(oldChart);
                        elements[i].appendChild(newChart);
                    }
                } else {
                    oldChart ? elements[i].removeChild(oldChart) : null;
                    elements[i].classList.add('empty');
                }
            }
        });
    },
    removeChart: function(e){
        var self = this;
        var index = e.model.index;
        var charts = self.charts;
        charts.splice(index, 1);
        return self.changeCharts(charts);
    },
    addChart: function(type){
        var self = this;
        var charts = self.charts;
        charts.push({type: type});
        return self.changeCharts(charts);
    },
    changeCharts: function(charts){
        var self = this;
        var url = app.apiUrl + 'resources/json/savedashboard.json';
        var body;
        var types = [];

        for(var i=0; i < charts.length; i++){
            charts[i].type ? types.push(charts[i].type) : null;
        }

        body = {'userId': app.sessionId, 'chartsLength': types.length, 'chartTypes': types};
        app.route.params && app.route.params.id ? body.portfolioId = app.route.params.id : null;

        sendRequest(url, 'POST', body, function(e){
            if(e.detail.response.success){
                self.charts = e.detail.response;
                //self.charts = charts;
                if(app.route.params){
                    for(var i=0; i < charts.length; i++){
                        if(app.portfolioItems[i].item.id == app.route.params.id){
                            app.portfolioItems[i].item.charts = charts;
                        }
                    }
                } else {
                    app.dashboardCharts = charts;
                    localStorage.setItem(app.apiUrl+ 'dashboard_charts', JSON.stringify(app.dashboardCharts));
                }
            //console.log(e);
                return self.buildChartsList(self.charts);
                //return self.buildChartsList(self.charts);
            } else {
                showAlert('Error', 'Server error');
            }
        });
    }
});

window.addEventListener('WebComponentsReady', function (e) {
    var resizeTimer = null;

    window.addEventListener('resize', function(){
        if(resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function() {
            var chartsLists = document.getElementsByTagName('charts-list');
            for(var i=0; i< chartsLists.length; i++) {
                chartsLists[i].buildChartsList(chartsLists[i].charts);
            }
        }, 500);
    });
});
