(function(){
    var resizeTimer = null;
    window.addEventListener('resize', function(){
        if(resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function() {
            var chartsLists = document.getElementsByTagName('charts-list');
            for(var i=0; i< chartsLists.length; i++) {
                chartsLists[i].buildChartsList(chartsLists[i].charts);
            }
        }, 500);
    });

    Polymer({
        is: 'charts-list',
        ready: function () {
            this.openAnimationConfig = app.openAnimationConfig;
        },
        properties: {
            charts: {
                type: Array,
                value: [],
                observer: '_chartsChanged'
            },
            data: {
                type: Array,
                value: new Array(4)
            },
            openAnimationConfig: {
                type: Object,
                value: {}
            },
            listLength: {
                type: Number,
                value: 4
            },
            options: {
                type: Object,
                value: {
                    animation: false
                }
            }
        },
        _chartsChanged: function(){
            var self = this;
            setTimeout(function(){
                if(self.charts.length < self.listLength){
                    var difference = new Array(self.listLength - self.charts.length);
                    self.charts.concat(difference);
                }
                return self.buildChartsList(self.charts);
            });
        },
        updateCharts: function(list){
            var chartsElements = list.getElementsByClassName('holding-chart');
            setTimeout(function(){
                for(var i=0; i< chartsElements.length; i++) {
                    chartsElements[i].updateChart();
                }
            }, 0);
        },
        resizeCharts: function(){
            var charts = document.getElementsByClassName('holding-chart');
            setTimeout(function(){
                for(var i=0; i< charts.length; i++) {
                    charts[i].resize();
                }
            }, 0);
        },
        buildChartsList: function(charts){
            var self = this;
            var elements = document.getElementsByClassName('chart-item-wrapper');

            setTimeout(function(){
                for(var i=0; i < elements.length; i++) {
                    var oldChart = elements[i].getElementsByClassName('chart-item')[0];
                    var empty = elements[i].classList.contains('empty');

                    if(charts[i].data){
                        var type = charts[i].type || 'line';
                        var newChart = document.createElement('chart-'+type);
                        newChart.data = charts[i].data;
                        newChart.options = self.options;
                        newChart.className = 'chart-item holding-chart style-scope charts-list';
                        if(empty){
                            elements[i].appendChild(newChart);
                            elements[i].classList.remove('empty');
                        } else {
                            elements[i].removeChild(oldChart);
                            elements[i].appendChild(newChart);
                        }
                    } else {
                        elements[i].removeChild(oldChart);
                        elements[i].classList.add('empty');
                    }
                }
            });
        }
    });
})();
