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
        },
        activeColor: {
            type: String
        }
    },
    observers: [ //listeners
        '_holdingsChanged(holdings)',
        '_tableSizeChanged(tableSize)',
        '_pageChanged(pageSelected)',
        '_colorChanged(activeColor)'
    ],
    _colorChanged: function(newVal){
        this.customStyle['--main-color'] = newVal;
        Polymer.updateStyles();
    },
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

        setTimeout(function(){
            var rows = self.getElementsByClassName('category-item-row');
            var startIndex = parseInt(self.tableSize) * parseInt(page);
            var finishIndex = startIndex + parseInt(self.tableSize) - 1;

            for(var i=0; i < rows.length; i++){
                var isCategory = rows[i].previousSibling.previousSibling;
                var mobileHeader = rows[i].previousSibling;
                //var isMobileRow = rows[i].nextSibling;
                var sameMobileCategory = isCategory.previousSibling;

                if(i < startIndex || i > finishIndex){
                    rows[i].classList.add('hidden-row');
                    if(mobileHeader.classList.contains('mobile-data-row-thead')){
                        mobileHeader.classList.add('hidden-row');
                    }
                    if(isCategory.classList.contains('category-row')){
                        isCategory.classList.add('hidden-row');
                        sameMobileCategory.classList.add('hidden-row');
                    }
                    if(!rows[i].classList.contains('mobile-data-td')){
                        rows[i].classList.add('mobile-data-td');
                    }
                } else {
                    if(rows[i].classList.contains('hidden-row')){
                        rows[i].classList.remove('hidden-row');
                        if(mobileHeader.classList.contains('mobile-data-row-thead')){
                            mobileHeader.classList.remove('hidden-row');
                        }
                        if(isCategory.classList.contains('category-row')){
                            if(isCategory.classList.contains('hidden-row')){
                                isCategory.classList.remove('hidden-row');
                                sameMobileCategory.classList.remove('hidden-row');
                            }
                        }
                    }
                }

                if(i == startIndex){
                    rows[i].classList.remove('mobile-data-td');
                }
            }
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
        var firstColl = this.querySelectorAll('.data-thead-th.start-coll')[0];
        var icon = firstColl.querySelectorAll('iron-icon')[0];

        if(!activeElement.classList.contains('start-coll')){
            activeElement.classList.remove('active');
            firstColl.classList.add('active');
        }

        icon.classList.remove('arrow-down');
        icon.classList.add('arrow-up');
    },
    hideCategoryRow: function(query, search){
        if(search && search.length > 0){
            return true;
        }
        if(query){
            return true;
        }
    },
    hideMobileCategoryRow: function(query, search){
        if(search && search.length > 0){
            return true;
        }
        if(!query){
            return true;
        }
    },
    collapseCategory: function(e){
        var row = e.currentTarget;
        var nextCategory = false;
        var stepRow = row.nextSibling;
        var collapsed = row.classList.contains('collapsed');
        var icon = row.getElementsByTagName('iron-icon')[0];
        var mobile = this.tabWidthScreen;
        var sameCategory = mobile ? row.nextSibling : row.previousSibling ;
        var sameIcon = sameCategory.getElementsByTagName('iron-icon')[0];

        if(collapsed){
            icon.classList.remove('arrow-right');
            sameIcon.classList.remove('arrow-right');
            icon.classList.add('arrow-up');
            sameIcon.classList.add('arrow-up');
        } else {
            icon.classList.remove('arrow-up');
            sameIcon.classList.remove('arrow-up');
            icon.classList.add('arrow-right');
            sameIcon.classList.add('arrow-right');
        }

        do {
            if(stepRow && stepRow.classList.contains('category-item-row') || stepRow.classList.contains('mobile-data-row-thead')){
                if(collapsed){
                    stepRow.classList.remove('collapsed-row');
                } else {
                    stepRow.classList.add('collapsed-row');
                }
            }
            if(!stepRow || mobile ? stepRow.classList.contains('mobile-data-thead') : stepRow.classList.contains('category-row') ){
                if(collapsed){
                    row.classList.remove('collapsed');
                    sameCategory.classList.remove('collapsed');
                } else {
                    row.classList.add('collapsed');
                    sameCategory.classList.add('collapsed');
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
        var tableBody = this.querySelectorAll('.data-tbody')[0];
        var rows = tableBody.querySelectorAll('.tr');

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
            if(type.contains('category-row') || type.contains('mobile-data-thead')){
                var categoryIcon = rows[i].getElementsByTagName('iron-icon')[0];

                if(allClosed){
                    categoryIcon.classList.remove('arrow-right');
                    categoryIcon.classList.add('arrow-up');
                } else {
                    categoryIcon.classList.remove('arrow-up');
                    categoryIcon.classList.add('arrow-right');
                }

                allClosed ? type.remove('collapsed') : type.add('collapsed');
            }
            if(type.contains('category-item-row') || type.contains('mobile-data-row-thead')){
                allClosed ? type.remove('collapsed-row') : type.add('collapsed-row');
            }
        }
    },
    showNoResults: function(pages, search){
        return search && !pages.length;
    }
});
