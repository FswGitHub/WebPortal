(function (){
    app.portfolioItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio_items_data')) : {};
    app.closeAnimationConf = [{name: 'fade-out-animation', timing: {duration: 200}}];
    app.tableSize = 50;
    app.pageSelected = 1;
    app.filter = 'name';

    app.properties = {
        portfolioItems: {
            type: Object,
            value: {},
            notify: true
        },
        searchRequest: {
            type: String,
            value: ''
        },
        currentPortfolioItem: {
            type: Object,
            computed: 'getCurrentPortfolioItem(portfolioItems, route.params.id)'
        },
        currentClassificationsData: {
            type: Object,
            computed: 'getClassificationsData(currentPortfolioItem, selectedClassification.id)'
        },
        selectedClassification: {
            type: Object,
            value: {},
            observer: '_classificationChanged'
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

    app.getCurrentPortfolioItem = function(items, id){
        app.selectedClassification = items[id] &&  items[id].classifications? items[id].classifications[0] : null;
        return items[id] ? items[id] : null;
    };

    app.getClassificationsData = function(item, id){
        return id && item ? item.classificationsContent[id] : null;
    };

    app._classificationChanged = function(){
        app.scrollPageToTop();
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

    //app.getPortfolioItemCharts = function(id){
    //    sendRequest(app.apiUrl + 'resources/json/portfolio-item' + id + '/' + app.sessionId+ '.json', 'GET', null, function(e){
    //        app.portfolioItems[id].charts = e.detail.response.item.charts;
    //        if(parseInt(id) == app.route.params.id){
    //            var chartList = document.getElementById('portfolioChartsList'+id);
    //            chartList.charts = e.detail.response.item.charts;
    //            chartList.setChart();
    //            console.log(chartList.charts);
    //        }
    //        localStorage.setItem(app.apiUrl+ 'portfolio_items_data', JSON.stringify(app.portfolioItems));
    //    });
    //
    //};

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
