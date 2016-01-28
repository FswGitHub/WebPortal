(function (){
    app.portfolioItems = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio_items_data')) : null;
    //app.chosenDate = formatDate(new Date());

    app.toggleCalendar = function(){
        var calendar = document.getElementById('calendar');
        calendar.toggle();
    };

    app.closeAnimationConf = [{name: 'fade-out-animation', timing: {duration: 200}}];

    app.getCategories = function(items, id){
        if(items[id]){
            app.curClassification = items[id].classifications[0].name;
            app.cleanSearch();
            return items[id].classifications;
        } else {
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
        if(bar.classList.contains('full-width-search') && !this.searchRequest){
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
