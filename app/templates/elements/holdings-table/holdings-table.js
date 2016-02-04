Polymer({
    is: 'holdings-table',
    properties: {
        holdings: {
            type: Array,
            value: []
        },
        pages: {
            type: Array,
            value: []
        },
        tableSize: {
            type: Number,
            value: 50
        },
        pageSelected: {
            type: Number,
            value: 0
        },
        filter: {
            type: String,
            value: 'name'
        }
    },
    observers: [
        '_holdingsChanged(holdings)',
        '_tableSizeChanged(tableSize)'
    ],
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
    },
    _holdingsChanged: function(newVal){
        if(newVal && newVal.length){
            this.tableSize = 50;
            this.setPages();
        }
    },
    _tableSizeChanged: function(newVal, oldVal){
        if(newVal != oldVal){
            this.setPages();
        }
    },
   setPages: function(){
       var self = this;
       setTimeout(function(){
           var rows = self.getElementsByClassName('category-item-row');
           var pages = Math.ceil(rows.length/self.tableSize);

           //0-49
           //50-99
           //100-149
           //150-rows.length
           self.pages = new Array(pages);
       })
    },
    getPageNumber: function(index){
        return index+1;
    },
    selectFirst: function(){
        this.$.pages.select(0);
    },
    selectPrev: function(){
        this.$.pages.selectPrevious();
    },
    selectNext: function(){
        this.$.pages.selectNext()
    },
    selectLast: function(){
        this.$.pages.select(this.pages.length - 1);
    }
});
