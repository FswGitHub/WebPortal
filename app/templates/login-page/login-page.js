(function (){
    app.signUp = false;
    app.forgotPass = false;
    app.confirm = false;
    app.testEmail = 'alan.ball@outlook.com';
    app.testPass = 'pass13245';
    app.loader = false;

    app.toggleSignUp = function(){
        if(app.route.name == 'login'){
            page('/signup');
            cleanForm('.sign-up', true);
        } else {
            page('/login');
        }
    };

    app.toggleConfirm = function(){
        page('/confirm');
    };

    app.toggleForgotPass = function(){
        cleanForm('.forgot-pass', true);
        page('/forgotpass');
    };

    app._rememberMeChanged = function(newVal){
        if(newVal){
            localStorage.setItem(app.apiUrl + 'remember_me', app.rememberMe);
        } else {
            localStorage.removeItem(app.apiUrl + 'remember_me');
        }
    };

    app.signInSubmit = function(){
        var email = document.getElementById('signInEmail');
        var pass = document.getElementById('signInPass');

        app.loader = true;

        if(email.validate() && pass.validate()){
            var url = app.apiUrl + 'resources/json/login.json';
            sendRequest(url, 'POST', {email: email.value, password: pass.value}, signInResponse);
        }
    };

    app.signUpSubmit = function(){
        var first = document.getElementById('signUpFirstName');
        var last = document.getElementById('signUpLastName');
        var email = document.getElementById('signUpEmail');
        var pass = document.getElementById('signUpPass');

        if(first.validate() && last.validate() && email.validate() && pass.validate()){
            var url = app.apiUrl + 'resources/json/signup.json';
            var body = {
                firstName: first.value,
                lastName: last.value,
                email: email.value,
                password: pass.value
            };
            sendRequest(url, 'POST', body, signUpResponse);
        }
    };

    function signUpResponse(e){
        if(e.detail.response.success){
            app.toggleConfirm();
        } else {
            showAlert('Error', 'Something wrong, try again later');
        }
        app.login.signUp = null;
    }

    app.sentForgotPass = function(){
        var forgotPassEmail = document.getElementById('forgotPassEmail');
        var email = forgotPassEmail.value;

        if(forgotPassEmail.validate()){
            //request should be here
            showAlert(null, 'Please check your email and click the verification link to reset your password.', function(){
                page('login');
            });
        }
    };

    app.submitNewPass = function(){
        var newPass = document.getElementById('newPass');
        var confirmPass = document.getElementById('newPassConfirm');
        app.passNotMatch = false;

        if(newPass.validate()){
            if(newPass.value == confirmPass.value){
                //request should be here, but first get value from query sting
                //app.route.resetValue
                showAlert(null, 'Your password is update.', function(){
                    cleanForm('.reset-form', true);
                    page('/login');
                });
            } else {
                app.passNotMatch = true;
            }
        }
    };
})();

function signInResponse(e){
    if(e.detail.response.success){
        var appColor = e.detail.response.user.colour;
        app.sessionId = e.detail.response.user.userId;
        loadAllData(app.sessionId, appColor);
    } else {
        app.loader = false;
        showAlert('Error', 'Wrong login, password or your account has not been verified. Please check the verification email that was sent.');
    }
}

function loadAllData(userId, appColor){
    var loadData = [
        {url: app.apiUrl + 'resources/json/sidemenu.json/' + userId, method: 'GET'},
        {url: app.apiUrl + 'resources/json/charts.json/' + userId, method: 'GET'},
        {url: app.apiUrl + 'resources/json/portfolio.json/' + userId, method: 'GET'},
        {url: app.apiUrl + 'resources/json/user.json/' + userId, method: 'GET'},
        {url: app.apiUrl + 'resources/json/settings.json', method: 'GET'},
        {url: app.apiUrl + 'resources/json/users.json', method: 'GET'}
    ];
    sendMultipleRequest(loadData, function(data){
        app.menuSubItems = data[0].content;
        app.theme = data[0].theme;
        app.logo = 'assets/' + data[0].logo;
        app.dashboardCharts = data[1].content;
        app.portfolioData = data[2].item;
        app.userData = data[3].user;
        app.userPhoto = app.userData && app.userData.photo ? 'assets/' + app.userData.photo : null;
        app.settings = data[4];
        app.users = data[5].users;
        getPortfolioItemsContent(data[0].content);
        if(app.rememberMe){
            localStorage.setItem(app.apiUrl + 'session_id', userId);
            localStorage.setItem(app.apiUrl+ 'app_colour', appColor ? appColor : '#DD1F29');
            localStorage.setItem(app.apiUrl + 'portfolio_items', JSON.stringify(app.menuSubItems));
            localStorage.setItem(app.apiUrl + 'theme', app.theme);
            localStorage.setItem(app.apiUrl + 'logo', app.logo);
            localStorage.setItem(app.apiUrl+ 'dashboard_charts', JSON.stringify(app.dashboardCharts));
            localStorage.setItem(app.apiUrl+ 'portfolio', JSON.stringify(app.portfolioData));
            localStorage.setItem(app.apiUrl+ 'user', JSON.stringify(app.userData));
            localStorage.setItem(app.apiUrl+ 'settings', JSON.stringify(app.settings));
            localStorage.setItem(app.apiUrl+ 'users', JSON.stringify(app.users));
        }
        return (function (){
            if(app.route.main){
                showAlert('Success', 'You login as ' + app.userData.firstName + ' ' + app.userData.lastName);
                cleanCharts();
            } else {
                app.loader = false;
                page('/dashboard');
            }
        })();
    });
}

function getPortfolioItemsContent(content){
    var portfolioItemsRequestData = [];
    app.portfolioItems = {};
    for(var i=0; i< content.length; i++){
        portfolioItemsRequestData.push({url: app.apiUrl + 'resources/json/portfolio-item' +  content[i].id + '/' + app.sessionId  + '.json', method: 'GET'});
    }
    sendMultipleRequest(portfolioItemsRequestData, function(data){
        for(var i=0; i< data.length; i++){
            if(data[i].item){
                app.portfolioItems[data[i].item.id] = data[i].item;
                if(data[i].item.classifications){
                    getItemClassifications(data[i].item);
                }
            }
        }
        return localStorage.setItem(app.apiUrl+ 'portfolio_items_data', JSON.stringify(app.portfolioItems));
    });
}

function getItemClassifications(item){
    var classificationsRequestData = [];
    app.portfolioItems[item.id].classificationsContent = {};

    for(var i=0; i < item.classifications.length; i++){
        classificationsRequestData.push({url: app.apiUrl + 'resources/json/portfolio-item' +  item.id + 'classification'+ item.classifications[i].id + '.json', method: 'GET'});
    }
    sendMultipleRequest(classificationsRequestData, function(data){
        for(var i=0; i< data.length; i++){
            if(data[i].item){
                app.portfolioItems[item.id].classificationsContent[data[i].item.id] = data[i].item;
            }
        }
        return localStorage.setItem(app.apiUrl+ 'portfolio_items_data', JSON.stringify(app.portfolioItems));
    });
}
