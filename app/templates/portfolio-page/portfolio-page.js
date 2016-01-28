(function () {
    app.portfolioData = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'portfolio')) : null;

    app.goToPortfolioItem = function(e){
        var id = e.model.item.id;
        return page('/portfolio/'+id+'/dashboard');
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
})();
