Polymer({
    is: 'charts-list',
    properties: {
        charts: {
            type: Array,
            value: []
        },
        chartsList: {
            type: Array,
            computed: 'setChartsList(charts, listLength)'
        },
        openAnimationConfig: {
            type: Object,
            value: {}
        },
        listLength: {
            type: Number,
            value: 4
        },
        loading: {
            type: Boolean,
            value: false
        }
    },
    addEmpty: function(data){
        return !data ? 'empty' : null;
    },
    setChartsList: function(charts, listLength){
        var chartsList = [];
        for(var i=0; i < listLength; i++) {
            if(charts[i]){
                chartsList.push(charts[i]);
            } else {
                chartsList.push([]);
            }
        }
        return chartsList;
    },
    ready: function () {
        this.openAnimationConfig = app.openAnimationConfig;
    },
    setTypes: function(type){
        if(!type) {
            return null;
        } else {
            var types = ['Line', 'Bar', 'Radar', 'Pie', 'Doughnut', 'Polar'];
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

        if(charts.length < self.listLength){
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

        charts[chartIndex].type = e.model.type;
        return self.changeCharts(charts)
    },
    changeCharts: function(charts){
        var self = this;
        var url = app.apiUrl + 'resources/json/savedashboard.json';
        var body;
        var types = [];

        self.loading = true;

        for(var i=0; i < charts.length; i++){
            if(charts[i].type) {
                types.push(charts[i].type);
            }
        }

        body = {userId: app.sessionId, chartsLength: types.length, chartTypes: types};
        app.route.params && app.route.params.id ? body.portfolioId = app.route.params.id : null;

        sendRequest(url, 'POST', body, function(e){
            if(e.detail.response.success){
                self.loading = false;
                if(app.route.params){
                    app.getPortfolioItemCharts(app.route.params.id);
                } else {
                    app.getDashboardCharts();
                }
            } else {
                self.loading = false;
                showAlert('Error', 'Server error');
            }
        });
    }
});
