(function (){
    app.signUp = false;
    app.forgotPass = false;
    app.confirm = false;
    app.login = {
        signIn: {email: 'alan.ball@outlook.com', pass: 'pass13245'},
        signUp: {}
    };
    app.loader = false;

    app.toggleSignUp = function(){
        app.signUp = !app.signUp;
    };

    app.toggleConfirm = function(){
        app.confirm = !app.confirm;
        if(app.confirm){
            setTimeout(function(){
                app.confirm = false;
                app.signUp = false;
            }, 5000);
        }
    };

    app.toggleForgotPass = function(){
        app.forgotPass = !app.forgotPass;
    };

    app.showSignInForm = function(signIn, forgotPass, confirm, reset){
        return signIn || forgotPass || confirm || reset;
    };

    app.showSignUpForm = function(signIn, confirm, reset){
        return !signIn || confirm || reset;
    };

    app.forgotPassButtonText = function(text){
        if(text && text.length > 0){
            return 'Submit';
        } else {
            return 'Go back';
        }
    };

    app.signInSubmit = function(){
        var email = document.getElementById('signInEmail');
        var pass = document.getElementById('signInPass');

        app.loader = true;

        if(email.validate() && pass.validate()){
            var url = app.apiUrl + 'resources/json/login.json';
            sendRequest(url, 'POST', {email: app.login.signIn.email, password: app.login.signIn.pass}, signInResponse);
        }
    };

    function signInResponse(e){
        var loadData;
        if(e.detail.response.success){
            app.sessionId = e.detail.response.user.userId;
            loadData = [
                {url: app.apiUrl + 'resources/json/sidemenu.json/' + app.sessionId, method: 'GET'},
                {url: app.apiUrl + 'resources/json/charts.json/' + app.sessionId, method: 'GET'},
                {url: app.apiUrl + 'resources/json/portfolio.json/' + app.sessionId, method: 'GET'},
                {url: app.apiUrl + 'resources/json/user.json/' + app.sessionId, method: 'GET'},
                {url: app.apiUrl + 'resources/json/settings.json', method: 'GET'},
                {url: app.apiUrl + 'resources/json/users.json', method: 'GET'}
            ];
            sendMultipleRequest(loadData, function(data){
                console.log(data);
                app.menuSubItems = data[0].content;
                app.theme = data[0].theme;
                app.logo = 'assets/' + data[0].logo;
                app.dashboardCharts = formatChartsDatasets(data[1].content);
                if(app.rememberMe){
                    localStorage.setItem(app.apiUrl + 'session_id', app.sessionId);
                    localStorage.setItem(app.apiUrl + 'portfolio_items', JSON.stringify(app.menuSubItems));
                    localStorage.setItem(app.apiUrl + 'theme', app.theme);
                    localStorage.setItem(app.apiUrl + 'logo', app.logo);
                    localStorage.setItem(app.apiUrl+ 'dashboard/charts', JSON.stringify(app.dashboardCharts));
                }
                app.loader = false;
                page('/dashboard');
                getPortfolioItemsContent(data[0].content);
            });
        } else {
            app.dialog = {
                dismissText: 'OK',
                header: 'Error',
                text: 'Wrong login, password or your account has not been verified. Please check the verification email that was sent.'
            };
            app.loader = false;
            dialog.open();
        }
    }

    app.signUpSubmit = function(){
        var first = document.getElementById('signUpFirstName');
        var last = document.getElementById('signUpLastName');
        var email = document.getElementById('signUpEmail');
        var pass = document.getElementById('signUpPass');

        if(first.validate() && last.validate() && email.validate() && pass.validate()){
            var url = app.apiUrl + 'resources/json/signup.json';
            var body = {
                firstName: app.login.signUp.firstName,
                lastName: app.login.signUp.lastName,
                email: app.login.signUp.email,
                password: app.login.signUp.pass
            };
            sendRequest(url, 'POST', body, signUpResponse);
        }
    };

    function signUpResponse(e){
        if(e.detail.response.success){
            app.toggleConfirm();
        } else {
            app.dialog = {
                dismissText: 'OK',
                header: 'Error',
                text: 'Something wrong, try again later'
            };
            dialog.open();
        }

        app.login.signUp = null;
    }

    app.sentForgotPass = function(){
        var forgotPassEmail = document.getElementById('forgotPassEmail');

        if(app.login.forgotPassEmail && app.login.forgotPassEmail.length > 0){
            if(forgotPassEmail.validate()){
                app.dialog = {
                    dismissText: 'OK',
                    header: '',
                    text: 'Please check your email and click the verification link to reset your password.'
                };
                app.dialogClose = app.toggleForgotPass;
                dialog.open();
            }
        } else {
            app.login.forgotPassEmail = null;
            forgotPassEmail.invalid = false;
            app.toggleForgotPass();
        }
    };

    app.submitNewPass = function(){
        var newPass = document.getElementById('newPass');

        app.passNotMatch = false;
        if(newPass.validate()){
            if(app.login.newPassConfirm == app.login.newPass){
                app.dialog = {
                    dismissText: 'OK',
                    header: '',
                    text: 'Your password is update.'
                };
                app.dialogClose = function(){
                    page('/login');
                };
                dialog.open();
            } else {
                app.passNotMatch = true;
            }
        }
    }
})();

function getPortfolioItemsContent(content){
    var portfolioItemsRequestData = [];
    for(var i=0; i< content.length; i++){
        portfolioItemsRequestData.push({url: app.apiUrl + 'resources/json/portfolio-item' +  content[i].id + '/' + app.sessionId  + '.json', method: 'GET'});
    }
    sendMultipleRequest(portfolioItemsRequestData, function(data){
        console.log(data);
    });
}
