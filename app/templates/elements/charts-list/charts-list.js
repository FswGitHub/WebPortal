(function(){
    var resizeTimer = null;
    window.addEventListener('resize', function(){
        if(resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function() {
            var chartsLists = document.getElementsByTagName('charts-list');
            for(var i=0; i< chartsLists.length; i++) {
                chartsLists[i].updateCharts();
            }
        }, 500);
    });

    Polymer({
        is: 'charts-list',
        ready: function () {
            var self = this;
            self.openAnimationConfig = app.openAnimationConfig;
        },
        properties: {
            charts: {
                type: Array,
                value: [],
                observer: '_chartsChanged'
            },
            openAnimationConfig: {
                type: Object,
                value: {}
            },
            options: {
                type: Object,
                value: {
                    //scaleShowLabels : false,
                    //showXLabels: false
                    //scaleFontSize: 0
                }
            }
        },
        _chartsChanged: function(){
            var self = this;
            if(self.charts.length){
                //for(var i=0; i< self.charts.length; i++){
                    //if(i == self.charts.length - 1){
                        self.updateCharts();
                    //}
                //}
            }
        },
        updateCharts: function(){
            var chartsElements = document.getElementsByClassName('holding-chart');
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
        }
    });
})();
