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

    app.cleanSearch = function(){
        this.searchRequest = null;
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
