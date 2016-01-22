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
    setTypes: function(type){
        type = type == 'polar-area' ? 'polar' : type;
        if(!type) {
            return null;
        } else {
            var types = ['line', 'bar', 'radar', 'pie', 'doughnut', 'polar'];
            var index = types.indexOf(type);
            if(index > -1 && index < 3){
                types.splice(index, 1).splice(2, 3);
                types.splice(2, 3);
                return types;
            } else if(index > -1 && index > 2){
                types.splice(index, 1);
                types.splice(0, 3);
                return types;
            }
        }
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
        var types = [];

        for(var i=0; i < charts.length; i++){
            charts[i].type && charts[i].data ? types.push(charts[i].type) : null;
        }

        if(types.length < self.listLength){
            charts.push({type: type});
            return self.changeCharts(charts);
        } else {
            return showAlert(null, 'Only 4 charts allowed.');
        }
    },
    changeTypeChart: function(e){
        var self = this;
        var charts = self.charts;
        var chartIndex = e.target.getAttribute('data-index');
        var newType = e.model.type;

        charts[chartIndex].type = newType == 'polar' ? 'polar-area' : newType;
        return self.changeCharts(charts)
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
                for(var k=0; k <self.listLength; k++){
                    charts[k] ? self.charts[k] = charts[k] : self.charts[k] = {};
                }
                if(app.route.params){
                    for(var i=0; i < charts.length; i++){
                        if(app.portfolioItems[i].item.id == app.route.params.id){
                            app.portfolioItems[i].item.charts = e.detail.response;
                        }
                    }
                } else {
                    app.dashboardCharts = e.detail.response;
                    localStorage.setItem(app.apiUrl+ 'dashboard_charts', JSON.stringify(app.dashboardCharts));
                }
                return self.buildChartsList(self.charts);
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
