(function(){
    Polymer({
        is: 'charts-list',
        ready: function () {
            var self = this;
            self.updateCharts();
        },
        properties: {
            charts: {
                type: Array,
                value: {}
            },
            dataBar: {
                type: Object,
                value: {
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
                }
            },
            dataPie: {
                type: Array,
                value: [
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
            }
        },
        updateCharts: function(){
            var self = this;
            setTimeout(function(){
                self.$.chartBar.updateChart();
                self.$.chartPie.updateChart();
            }, 0);
        },
        getChartsData: function(){
            var self = this;
            app.method = 'GET';
            app.url = app.apiUrl + 'resources/json/charts.json/' + app.sessionId;
            app.handleResponse = self.chartsResponse;
            request.generateRequest();
        },
        chartsResponse: function(event, details){
            var self = this;
            var chart1 = {};
            if(details.response.success){
                self.charts = details.response.content;
                chart1 = self.charts[0];
                localStorage.setItem('chart1', JSON.stringify(chart1));
            }
            return chart1;
        }
    });
})();
