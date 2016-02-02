Polymer({
    is: 'chart-item',
    properties: {
        chartData: {
            type: Object,
            observer: '_chartChanged'
        },
        options: {
            type: Object
        }
    },
    ready: function(){

    },
    _chartChanged: function(){
    },
    setChart: function(){
        var me = this;
        if (me.chart) me.chart.destroy();
        if(this.chartData){
            setTimeout(function(){
                me.options = {
                    onAnimationComplete: function() {
                        me.fire('chartReady');
                    }
                };
                //Chart.defaults.global.responsive = true;
                Chart.defaults.global.animation = false;
                me.ctx = me.$.canvas.getContext('2d');
                switch (me.chartData.type){
                    case ('Line'):
                        me.data = toBarType(me.chartData.data);
                        me.options = {
                            bezierCurve: false
                        };
                        me.chart = new Chart(me.ctx).Line(me.data, me.options);
                        break;
                    case ('Bar'):
                        me.data = toBarType(me.chartData.data);
                        me.chart = new Chart(me.ctx).Bar(me.data, me.options);
                        break;
                    case ('Radar'):
                        me.data = toBarType(me.chartData.data);
                        me.chart = new Chart(me.ctx).Radar(me.data, me.options);
                        break;
                    case ('Polar'):
                        me.data = toPieType(me.chartData.data);
                        me.chart = new Chart(me.ctx).PolarArea(me.data, me.options);
                        break;
                    case ('Pie'):
                        me.data = toPieType(me.chartData.data);
                        me.chart = new Chart(me.ctx).Pie(me.data, me.options);
                        break;
                    case ('Doughnut'):
                        me.data = toPieType(me.chartData.data);
                        me.chart = new Chart(me.ctx).Doughnut(me.data, me.options);
                        break;
                    default:
                        break;
                }
            });
        } else {
            me.chart = null;
        }
    }
});

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
