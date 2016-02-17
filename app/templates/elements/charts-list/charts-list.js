Polymer({
    is: 'charts-list',
    properties: {
        charts: {
            type: Array,
            value: function(){
                return [];
            },
            notify: true
        },
        chartsList: {
            type: Array,
            computed: 'setChartsList(charts.*)'
        },
        openAnimationConfig: {
            type: Object
        },
        loading: {
            type: Boolean,
            value: false
        }
    },
    addEmpty: function(data){
        return !data ? 'empty' : null;
    },
    setChartsList: function(charts){
        var chartsList = [];
        var listLength = 4;

        for(var i=0; i < listLength; i++) {
            if(charts.base && charts.base[i]){
                chartsList.push(charts.base[i]);
            } else {
                chartsList.push({});
            }
        }
        return chartsList;
    },
    ready: function () {
        this.openAnimationConfig = app.openAnimationConfig;
    },
    buildCharts: function(index){
        var self = this;
        setTimeout(function(){
            var charts = self.getElementsByTagName('chart-item');
            if(!index){
                for(var i=0; i < charts.length; i++) {
                    charts[i].setChart();
                }
            } else {
                charts[index].setChart();
            }
            return  self.loading ? self.loading = false : self.loading;
        });
    },
    setTypes: function(item, ind, path){
        var types = [],
            type = this.get(path, item.base[ind]),
            kind;
        var barTypes = ['Line', 'Bar', 'Radar'];
        var pieTypes = ['Pie', 'Doughnut', 'Polar'];
        if(!type) {
            return null;
        } else {
            kind = barTypes.indexOf(type) > -1 ? barTypes : pieTypes;
            for(var i=0; i < kind.length; i++){
                if(kind[i] != type){
                    types.push(kind[i]);
                }
            }
            return types;
        }
    },
    removeChart: function(e){
        var self = this;
        var index = e.model.index;
        var charts = self.charts;

        charts.splice(index, 1);
        return self.changeCharts(charts, null, 'remove');
    },
    addChart: function(type){
        var self = this;
        var charts = self.charts ? self.charts : [];
        var listLength = 4;

        if(charts.length < listLength){
            charts.push({type: type});
            return self.changeCharts(charts, null, 'add');
        } else {
            return showAlert(null, 'Only 4 charts allowed.');
        }
    },
    changeTypeChart: function(e){
        var self = this;
        var charts = self.charts;
        var chartIndex = e.target.getAttribute('data-index');

        charts[chartIndex].type = e.model.type;
        return self.changeCharts(charts, chartIndex, 'change');
    },
    changeCharts: function(charts, index, action){
        var self = this;
        var url = app.apiUrl + 'resources/json/savedashboard.json';
        var body;
        var types = [];
        var id = app.route.params ? app.route.params.id : null;

        self.loading = true;

        for(var i=0; i < charts.length; i++){
            if(charts[i].type) {
                types.push(charts[i].type);
            }
        }

        body = {userId: app.sessionId, chartsLength: types.length, chartTypes: types};
        app.route.params && id ? body.portfolioId = id : null;

        sendRequest(url, 'POST', body, function(e){
            if(e.detail.response.success){
                //self.loading = false;
                switch (action){
                    case 'add':
                        if(id){
                            self.getPortfolioItemCharts(id);
                        } else {
                            self.getDashboardCharts();
                        }
                        break;
                    case 'remove':
                        if(id){
                            self.getPortfolioItemCharts(id);
                        } else {
                            self.getDashboardCharts();
                        }
                        break;
                    case 'change':
                        self.set('charts.'+index+'.type', charts[index].type);
                        console.log(self.get('charts.'+index+'.type'));
                        if(id){
                            app.portfolioItems[id].charts = charts;
                            localStorage.setItem(app.apiUrl+ 'portfolio_items_data', JSON.stringify(app.portfolioItems));
                        } else {
                            app.dashboardCharts = charts;
                            localStorage.setItem(app.apiUrl+ 'dashboard_charts', JSON.stringify(app.dashboardCharts));
                        }
                        return self.buildCharts(index);
                        break;
                }
            } else {
                showAlert('Error', 'Server error');
            }
        });
    },
    getPortfolioItemCharts: function(id){
        var self = this;
        sendRequest(app.apiUrl + 'resources/json/portfolio-item' + id + '/' + app.sessionId+ '.json', 'GET', null, function(e){
            if(e.detail.response.success){
                app.portfolioItems[id].charts = e.detail.response.item.charts;
                self.set('charts', app.portfolioItems[id].charts);
                localStorage.setItem(app.apiUrl+ 'portfolio_items_data', JSON.stringify(app.portfolioItems));
                return self.buildCharts();
            } else {
                showAlert('Error', 'Server error');
            }
        });
    },
    getDashboardCharts: function(){
        var self = this;
        sendRequest(app.apiUrl + 'resources/json/charts.json/' + app.sessionId, 'GET', null, function(e){
            if(e.detail.response.success){
                app.dashboardCharts = e.detail.response.content;
                localStorage.setItem(app.apiUrl+ 'dashboard_charts', JSON.stringify(app.dashboardCharts));
                self.set('charts', app.dashboardCharts);
                return self.buildCharts();
            } else {
                showAlert('Error', 'Server error');
            }
        });
    }
});
