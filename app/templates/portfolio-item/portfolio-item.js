(function (){
    app.portfolioItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio_items_data')) : {};
    app.closeAnimationConf = [{name: 'fade-out-animation', timing: {duration: 200}}];

    app.properties = {
        portfolioItems: {
            type: Object,
            value: {}
        },
        searchRequest: {
            type: String,
            value: ''
        },
        currentPortfolioItem: {
            type: Object,
            computed: 'getCurrentPortfolioItem(portfolioItems, route.params.id)',
            observer: 'showCurrent'
        },
        currentClassificationsData: {
            type: Object,
            computed: ''
        },
        portfolioItemCharts: {
            type: Array,
            computed: ''
        },
        selectedClassification: {
            type: Object,
            value: {
                name: 'None',
                id: {type: Number}
            }
        }
    };

    app.showCurrent = function(){
        console.log(app.currentPortfolioItem);
    };

    app.toggleCalendar = function(){
        var calendar = document.getElementById('calendar');
        calendar.toggle();
    };

    app.getCurrentPortfolioItem = function(items, id){
        return items[id] ? items[id] : null;
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
