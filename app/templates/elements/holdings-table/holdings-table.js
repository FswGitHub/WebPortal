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
        },
        reverse: {
            type: Boolean,
            value: false
        },
        categoryFilter: {
            type: String,
            computed: 'getCategoryFilter(filter)'
        },
        searchString: {
            type: String
        }
    },
    observers: [ //listeners
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
        this.setUpHeaderDefault();
    },
    _tableSizeChanged: function(){
        this.setPages();
    },
    setPages: function(page){
        var self = this;
        if(this.holdings.length){
            setTimeout(function(){
                var rows = self.getElementsByClassName('category-item-row');
                var pages = Math.ceil(rows.length/self.tableSize);

                self.pages = new Array(pages);

                if(!page){
                    if(self.pageSelected == 0){
                        self.showPage(self.pageSelected);
                    } else {
                        self.pageSelected = 0;
                    }
                } else {
                    self.showPage(page);
                }
            })
        }
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
    },
    limitValue: function(value){
        // Limit value to 2 symbols after point and add commas
        if(!value){
            return null;
        } else {
            var rounded = Math.round(value * 100) / 100;
            var fixed = rounded.toFixed(2);
            var stringValue = fixed.toString();
            return stringValue.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
        }
    },
    filterHoldings: function(e){
        var self = this;
        var element = e.currentTarget;
        var value = element.getAttribute('data-filter');
        var icon = element.querySelectorAll('iron-icon')[0];
        var activeElement = this.querySelectorAll('.data-thead-th.active')[0];
        var reverse = icon.classList.contains('arrow-up');

        if(!element.classList.contains('active')){
            element.classList.add('active');
            activeElement.classList.remove('active');
        }

        if(reverse){
            icon.classList.remove('arrow-up');
            icon.classList.add('arrow-down');
        } else {
            icon.classList.remove('arrow-down');
            icon.classList.add('arrow-up');
        }

        self.filter = value;
        self.reverse = reverse;
    },
    filterBy: function(items, filed, reverse){
        var filtered = [];
        var selected = this.pageSelected;
        if(!items) {
            return null;
        } else {
            for(var i=0; i < items.length; i++){
                filtered.push(items[i]);
            }
            filtered.sort(function (a, b) {
                if (a[filed] > b[filed]) {
                    return 1;
                }
                if (a[filed] < b[filed]) {
                    return -1;
                }
                return 0;
            });
        }
        this.setPages(selected);
        return reverse ? filtered.reverse() : filtered;
    },
    filterByName: function(string) {
        if (!string) {
            // set filter to null to disable filtering
            this.setPages();
            return null;
        } else {
            // return a filter function for the current search string
            string = string.toLowerCase();
            this.setPages();
            return function(item) {
                var name = item.name.toLowerCase();
                return (name.indexOf(string) != -1);
            };
        }
    },
    getCategoryFilter: function(field){
        if(field){
            switch (field) {
                case 'name':
                    return 'category';
                    break;
                case 'bookValue':
                    return 'totalBookValue';
                    break;
                case 'marketValue':
                    return 'totalMarketValue';
                    break;
                case 'percentageMV':
                    return 'totalPercentageMV';
                    break;
                case 'exposureValue':
                    return 'totalExposureValue';
                    break;
            }
        } else {
            return null;
        }

    },
    setUpHeaderDefault: function(){
        var activeElement = this.querySelectorAll('.data-thead-th.active')[0];
        var firstColl = this.querySelectorAll('.data-thead-th.row-start')[0];
        var icon = firstColl.querySelectorAll('iron-icon')[0];

        if(!activeElement.classList.contains('row-start')){
            activeElement.classList.remove('active');
            firstColl.classList.add('active');
        }

        icon.classList.remove('arrow-down');
        icon.classList.add('arrow-up');
    },
    hideCategoryRow: function(query, search){
        return query || search;
    },
    hideMobileCategoryRow: function(query, search){
        return !query || search;
    },
    collapseCategory: function(e){
        var row = e.currentTarget;
        var nextCategory = false;
        var stepRow = row.nextSibling;
        var collapsed = row.classList.contains('collapsed');
        var icon = row.getElementsByTagName('iron-icon')[0];

        if(collapsed){
            icon.classList.remove('arrow-right');
            icon.classList.add('arrow-up');
        } else {
            icon.classList.remove('arrow-up');
            icon.classList.add('arrow-right');
        }

        do {
            if(stepRow && stepRow.classList.contains('category-item-row')){
                if(collapsed){
                    stepRow.classList.remove('collapsed-row');
                } else {
                    stepRow.classList.add('collapsed-row');
                }
            }
            if(!stepRow || stepRow.classList.contains('category-row')){
                if(collapsed){
                    row.classList.remove('collapsed');
                } else {
                    row.classList.add('collapsed');
                }
                nextCategory = true;
                break;
            }

            stepRow = stepRow.nextSibling;
            nextCategory = false;
        } while (!nextCategory);
    },
    collapseAll: function(e){
        var trigger = e.currentTarget;
        var icon = trigger.getElementsByTagName('iron-icon')[0];
        var allClosed = trigger.classList.contains('all-closed');
        var rows = this.querySelectorAll('.data-tbody-tr');

        if(allClosed){
            icon.classList.remove('arrow-up');
            icon.classList.add('arrow-down');
            trigger.classList.remove('all-closed');
        } else {
            icon.classList.remove('arrow-down');
            icon.classList.add('arrow-up');
            trigger.classList.add('all-closed');
        }

        for(var i=0; i < rows.length; i++){
            var type = rows[i].classList;
            if(type.contains('category-row')){
                allClosed ? type.add('collapsed') :  type.remove('collapsed');
            }
            if(type.contains('category-item-row')){
                allClosed ? type.add('collapsed-row') : type.remove('collapsed-row') ;
            }
        }
    }
});
