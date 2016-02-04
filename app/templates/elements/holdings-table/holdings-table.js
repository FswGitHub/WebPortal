Polymer({
    is: 'holdings-table',
    properties: {
        holdings: {
            type: Array,
            value: []
        },
        tableSize: {
            type: Number,
            value: 50
        },
        pageSelected: {
            type: Number,
            value: 1
        },
        filter: {
            type: String,
            value: 'name'
        }
    },
    ready: function () {
        this.tabWidthScreen = app.tabWidthScreen;
    },
    addClass: function(variable, classString){
        if(variable){
            return classString;
        }
    },
    openTableRow: function(){

    },
    toggleClass: function(variable, class1, class2){
        return variable ? class1 : class2;
    }
});
