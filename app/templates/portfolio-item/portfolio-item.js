(function (){
    app.chosenDate = formatDate(new Date());
    app.selectedValue = 1;

    app.openCalendar = function(){
        var calendar = document.getElementById('calendar');
        calendar.toggle();
    };

    app.openCalendarConf =  [
        {name: 'fade-in-animation', timing: {delay: 150, duration: 200}},
        {name: 'expand-animation', timing: {delay: 150, duration: 200}}
    ];

    app.closeCalendarConf = [
        {name: 'fade-out-animation', timing: {duration: 200}}
    ];

    function formatDate(val){
        var monthNames = ["Jan", "Feb", "Mar",
            "Apr", "May", "Jun",
            "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"];
        var date = new Date(val);
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day+' '+monthNames[monthIndex]+' '+year;
    }
})();
