(function (){
    app.portfolioItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio_items_data')) : {};
    app.closeAnimationConf = [{name: 'fade-out-animation', timing: {duration: 200}}];
    app.tableSize = 50;
    app.pageSelected = 1;
    app.filter = 'name';
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
        currentClassificationsData: {
            type: Object,
            computed: 'getClassificationsData(portfolioItems, route, selectedClassification)'
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
        app.loader = true;
        setTimeout(function(){
            app.holdings = app.getHoldings(app.route, app.portfolioItems, app.selectedClassification);
            app.loader = false;
        }, 400);

        app.scrollPageToTop();
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
    //
    //app._holdingsChanged = function(newVal){
    //
    //};

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
            var oldChartsList = wrapper.getElementsByTagName('charts-list')[0];
            var chartsList = document.createElement('charts-list');

            if(!oldChartsList){
                wrapper.appendChild(chartsList);
                chartsList.charts = app.portfolioItems[index] ? app.portfolioItems[index].charts : null;
                return chartsList.buildCharts();
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
