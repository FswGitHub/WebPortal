( function (e) {
    app.dashboardCharts = (app.sessionId && localStorage.getItem(app.apiUrl +'dashboard_charts')) ? JSON.parse(localStorage.getItem(app.apiUrl +'dashboard_charts')) : getChartsData(app.apiUrl, app.sessionId);
    app.openAnimationConfig = [
        {name: 'fade-in-animation', timing: {delay: 100, duration: 200}},
        //{name: 'paper-menu-grow-width-animation', timing: {duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}},
        {name: 'paper-menu-grow-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both'}}
        //{name: 'paper-menu-shrink-width-animation', timing:{duration: 3000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
        //{name: 'paper-menu-shrink-height-animation', timing: {duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', "fill": 'both'}}
    ];
    app.addChart = function(e){
        var type = e.target.getAttribute('data-type');
        var chartList = document.getElementsByClassName('dashboard-charts-list')[0];
        if(app.dashboardCharts.length < 4){
            chartList.addChart(type);
        } else {
            showAlert(null, 'Only 4 charts allowed.');
        }
    };
})();

function formatChartsDatasets(items){
    var formatedData = [];

    for(var i=0; i < items.length; i++) {
        var item  = items[i];
        var type = item.type.toLowerCase();
        if(type == 'radar' || type == 'line' || type == 'bar'){
            item.data = toBarType(item.data);
            item.type = type;
            formatedData.push(item);
        } else {
            item.data = toPieType(item.data);
            item.type = type == 'polar'? 'polar-area' : type;
            formatedData.push(item);
        }
    }
    return formatedData;

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

function getChartsData(apiUrl, sessionId){
    var url = apiUrl + 'resources/json/charts.json/' + sessionId;
    if(!apiUrl || !sessionId){
        return [];
    } else {
        sendRequest(url, 'GET', null, function(response){
            return response;
        });
    }
}
