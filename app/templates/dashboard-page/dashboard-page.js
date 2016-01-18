(function(){
    //console.log('dashboard controller');
    app.dashboardCharts = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl +'dashboard/charts')) : null;
    app.openAnimationConfig = [
        {name: 'fade-in-animation', timing: {delay: 100, duration: 200}},
        //{name: 'paper-menu-grow-width-animation', timing: {duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}},
        {name: 'paper-menu-grow-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}}
        //{name: 'paper-menu-shrink-width-animation', timing:{duration: 3000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
        //{name: 'paper-menu-shrink-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
    ];

    app.getChartsData = function(){
        app.method = 'GET';
        app.url = app.apiUrl + 'resources/json/charts.json/' + app.sessionId;
        app.handleResponse = app.chartsResponse;
        request.generateRequest();
        console.log('sendes');
    };

    app.chartsResponse = function(e, details){
        if(details.response.success){
            console.log(details.response);
            localStorage.setItem(app.apiUrl+ 'dashboard/charts', JSON.stringify(details.response.content));
            return details.response.content;
        } else {
            return null;
        }
    };

    app._dashboardChartsChanged = function(){
        setTimeout(function(){
            var chartsElem = document.getElementById('chartsList');
            chartsElem.barChart = formatChartsDatasets(app.dashboardCharts[0]);
            chartsElem.barPie = formatChartsDatasets(app.dashboardCharts[3]);
        }, 0);
    };

    function formatChartsDatasets(item){
        if(item.type == ('Line' || 'Bar' || 'Radar')){
            return toBarType(item.data);
        } else {
            return toPieType(item.data);
        }

        function toBarType(data){
            var formatted = {
                labels: data.labels,
                datasets: []
            };
            for(var i=0; i< data.datasets.length; i++) {
                var barObject = {
                    fillColor: "rgba("+ hexToRGB(data.colors[i])+",0.2)",
                    strokeColor: "rgba("+ hexToRGB(data.colors[i])+",1)",
                    pointColor: "rgba("+ hexToRGB(data.colors[i])+",1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba("+ hexToRGB(data.colors[i])+",1)",
                    data: data.datasets[i].data,
                    label: data.datasets[i].label
                };
                formatted.datasets.push(barObject);
            }
            return formatted;
        }

        function toPieType(data){
            var formatted = [];
            for(var i=0; i< data.datasets.length; i++) {
                var barObject = {
                    value: data.datasets[i].data,
                    color: data.colors[i],
                    highlight: data.highlights[i],
                    label: data.labels[i]
                };
                formatted.push(barObject);
            }
            return formatted;
        }

        function hexToRGB(hex){
            var RGB = [];

            function toR(h) { return parseInt((cutHex(h)).substring(0,2),16) }
            function toG(h) { return parseInt((cutHex(h)).substring(2,4),16) }
            function toB(h) { return parseInt((cutHex(h)).substring(4,6),16) }
            function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}

            RGB[0] = toR(hex);
            RGB[1] = toG(hex);
            RGB[2] = toB(hex);

            return (RGB[0]+','+RGB[1]+','+ RGB[2]);
        }
    }
})();
