(function () {
    app.portfolioData = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio')) : null;

    app.goToPortfolioItem = function(e){
        if(e.model.item){
            var id = e.model.item.id;
            return page('/portfolio/'+id+'/dashboard');
        }
    };

    app.setDefaultRows = function(data, tabWidth){
        if(!data){
            return tabWidth ? new Array(1) : new Array(10);
        } else {
            var rows = data.length;
            if(tabWidth && !rows){
                return new Array(1);
            } else if(!tabWidth && rows < 10){
                return data.concat(new Array(10-rows));
            } else {
                return data;
            }
        }
    };

    app.openTableRow = function(e){
        var thisRow = e.currentTarget;
        var tbody = e.currentTarget.parentNode;
        var allRows = tbody.getElementsByClassName('data-tbody-tr');
        var openedRow = thisRow.nextSibling;

        openedRow.classList.remove('mobile-data-td');
        for(var i=0; i < allRows.length; i++){
            if(allRows[i] !== openedRow){
                allRows[i].classList.add('mobile-data-td');
            }
        }
    };

    app._tabWidthChanged = function(newVal){
        if(newVal && app.route){
            if(app.route.name == 'portfolio'){
                openFirstRows('.portfolio-table');
            }
            if(app.route.name == 'settings'){
                openFirstRows('.users-table');
            }
        }
    }
})();

//open first tables rows for mobile and tab screens
function openFirstRows(selector){
    var table = document.querySelectorAll(selector)[0];
    setTimeout(function(){
        //for(var i = 0; i < table.length; i++) {
            var allRows = table.getElementsByClassName('data-tbody-tr');
            var firstRow = allRows[0];
            firstRow ? firstRow.classList.remove('mobile-data-td') : null;
            for(var j=1; j < allRows.length; j++){
                if(!allRows[j].classList.contains('mobile-data-td')){
                    allRows[j].classList.add('mobile-data-td');
                }
            }
        //}
    });
}
