Polymer({
    is: 'holdings-table',
    properties: {
        holdings: {
            type: Object,
            computed: 'getHoldings(currentClassificationsData)'
        }
    },
    ready: function () {
        this.tabWidthScreen = app.tabWidthScreen;
        this.currentClassificationsData = app.currentClassificationsData;
    },
    addClass: function(variable, classString){
        if(variable){
            return classString;
        }
    },
    openTableRow: function(){

    },
    getHoldings: function(data){
        return data.holdings ? data.holdings : null;
    }
});
