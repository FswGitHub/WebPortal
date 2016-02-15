(function (){
    app.portfolioItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio_items_data')) : {};
    app.closeAnimationConf = [{name: 'fade-out-animation', timing: {duration: 200}}];
    app.holdings = null;

    app.properties = {
        portfolioItems: {
            type: Object,
            value: {}
        },
        searchRequest: {
            type: String,
            value: ''
        },
        currentClassifications: {
            type: Array,
            computed: 'getCurrentClassifications(portfolioItems, route)'
        },
        selectedClassification: {
            type: Object,
            value: {}
        },
        holdings: {
            type: Array
        }
    };

    app.addDashboardChart = function(e){
        var type = e.target.getAttribute('data-type');
        var section = document.getElementsByClassName('portfolio-item-'+app.route.params.id)[0];
        var wrapper = section.getElementsByClassName('p-dashboard-page-wrapper')[0];
        var chartList = wrapper.getElementsByTagName('charts-list')[0];
        chartList.addChart(type);
    };

    app.toggleCalendar = function(){
        var calendar = document.getElementById('calendar');
        calendar.toggle();
    };

    app.getCurrentClassifications = function(items, route){
        var id = route.params ? route.params.id : null;
        if(id){
            return items[id] ? items[id].classifications : null;
        } else {
            return null;
        }
    };

    app.getClassificationsData = function(items, route, selected){
        var id = route.params ? route.params.id : null;
        if(id){
            return selected && items[id] ? items[id].classificationsContent[selected.id] : null;
        } else {
            return null;
        }
    };

    app._classificationChanged = function(){
        if(app.route && app.route.name.indexOf('portfolio-item') > -1 && app.sessionId){
            app.loader = true;
            var holdings = app.getHoldings(app.route, app.portfolioItems, app.selectedClassification);
            var classification = app.getClassificationsData(app.portfolioItems, app.route, app.selectedClassification);

            setTimeout(function(){
                if(app.route.params){
                    var section = document.getElementsByClassName('portfolio-item-'+app.route.params.id)[0];
                    var wrapper = section.getElementsByClassName('p-holdings-page-wrapper')[0];
                    var holdingsTable = wrapper.getElementsByTagName('holdings-table')[0];

                    app.holdings = holdings;
                    holdingsTable.holdings = holdings;
                    holdingsTable.classification = classification;
                    app.loader = false;
                }
            }, 500);

            app.scrollPageToTop();
        }
    };

    app.getHoldings = function(route, items, selected){
        if(route && route.params && route.params.tab == 'holdings' && items[route.params.id]) {
            if(items[route.params.id].classificationsContent[selected.id]){
                return items[route.params.id].classificationsContent[selected.id].holdings;
            } else {
                return null;
            }
        }
        else {
            return null;
        }
    };

    app.startSearch = function(){
        if(this.mobileWidthScreen){
            var bar = document.getElementsByClassName('portfolio-item-toolbar')[0];
            if(bar.classList.contains('full-width-search')){
                bar.classList.remove('full-width-search');
            } else {
                bar.classList.add('full-width-search');
            }
        }
    };

    app.cleanSearch = function(){
        var bar = document.getElementsByClassName('portfolio-item-toolbar')[0];
        if(bar && bar.classList.contains('full-width-search') && !this.searchRequest){
            bar.classList.remove('full-width-search');
            this.searchRequest = null;
        } else {
            return this.searchRequest = null;
        }
    };

    app.getPortfolioCharts = function(portfolioItems, id){
        var current = portfolioItems[id];
        if(current){
            return current.charts && current.charts.length ? current.charts : [];
        } else {
            return [];
        }
    };

    app.addPortfolioChartsList = function(index){
        setTimeout(function(){
            var section = document.getElementsByClassName('portfolio-item-'+index)[0];
            var wrapper = section.getElementsByClassName('p-dashboard-page-wrapper')[0];
            var chartsList = wrapper.getElementsByTagName('charts-list')[0];

            if(chartsList && app.portfolioItems[index] && app.portfolioItems[index].charts.length && !chartsList.charts.length){
                chartsList.charts = app.portfolioItems[index] ? app.portfolioItems[index].charts : null;
                return setTimeout(function(){
                    chartsList.buildCharts();
                });
            }
        });
    };

    app.formatDate = function(val){
        var monthNames = ["Jan", "Feb", "Mar",
            "Apr", "May", "Jun",
            "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"];
        var date = new Date(val);
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day+' '+monthNames[monthIndex]+' '+year;
    };
})();
