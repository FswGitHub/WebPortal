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
            self.charts = [
                {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [65, 59, 80, 81, 56, 55, 40]
                        },
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 40, 19, 86, 27, 90]
                        }
                    ]
                },
                [
                    {
                        value: 300,
                        color:"#F7464A",
                        highlight: "#FF5A5E",
                        label: "Red"
                    },
                    {
                        value: 50,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "Green"
                    },
                    {
                        value: 100,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "Yellow"
                    }
                ]
            ];
            self.barChart = self.charts[0];
            self.barPie = self.charts[1];
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
            }
        },
        _chartsChanged: function(){
            var self = this;
            if(self.charts.length){
                //for(var i=0; i< self.charts.length; i++){
                    //self.charts[i] = self.formatChartsDatasets(self.charts[i]);
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
        },
        formatChartsDatasets: function(data){
            var formated;
            switch (data.type){
                case 'Bar' || 'Line' || 'Radar':
                    break;
                case 'Pie' || 'Doughnut' || 'Polar':
                    break;
            }
            return formated;
        }
    });
})();
