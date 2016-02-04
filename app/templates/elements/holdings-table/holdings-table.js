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
            type: Number
        },
        pageSelected: {
            type: Number
        },
        filter: {
            type: String,
            value: 'name'
        }
    },
    observers: [
        '_holdingsChanged(holdings)',
        '_tableSizeChanged(tableSize)',
        '_pageChanged(pageSelected)'
    ],
    ready: function () {
        this.openTableRow = app.openTableRow;
    },
    addClass: function(variable, classString){
        if(variable){
            return classString;
        }
    },
    //openTableRow: function(){
    //
    //},
    toggleClass: function(variable, class1, class2){
        return variable ? class1 : class2;
    },
    _holdingsChanged: function(newVal){
        if(newVal && newVal.length){
            if(!this.tableSize || this.tableSize != 50){
                this.tableSize = 50;
            } else {
                this.setPages();
            }
        }
    },
    _tableSizeChanged: function(){
        this.setPages();
    },
    setPages: function(){
        var self = this;
        setTimeout(function(){
            var rows = self.getElementsByClassName('category-item-row');
            var pages = Math.ceil(rows.length/self.tableSize);

            self.pages = new Array(pages);

            if(self.pageSelected  == 0){
                self.showPage(self.pageSelected);
            } else {
                self.pageSelected = 0;
            }
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
    },
    showPage: function(page){
        var self = this;
        var rowName = self.tabWidthScreen ? 'mobile-data-row-thead' : 'category-item-row';
        var categoryRow = self.tabWidthScreen ?  'mobile-data-thead' : 'category-row';
        setTimeout(function(){
            var rows = self.getElementsByClassName(rowName);
            var startIndex = parseInt(self.tableSize) * parseInt(page);
            var finishIndex = startIndex + parseInt(self.tableSize) - 1;

            for(var i=0; i < rows.length; i++){
                var isCategory = rows[i].previousSibling.previousSibling;
                if(i < startIndex || i > finishIndex){
                    rows[i].classList.add('hidden-row');
                    if(isCategory.classList.contains(categoryRow)){
                        isCategory.classList.add('hidden-row');
                    }
                } else {
                    if(rows[i].classList.contains('hidden-row')){
                        rows[i].classList.remove('hidden-row');
                        if(isCategory.classList.contains(categoryRow)){
                            if(isCategory.classList.contains('hidden-row')){
                                isCategory.classList.remove('hidden-row');
                            }
                        }
                    }

                }
            }

            //console.log(startIndex + '-' +finishIndex);
        })
    },
    _pageChanged: function(){
        this.showPage(this.pageSelected);
    }
});
