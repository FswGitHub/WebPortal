(function (){
    app.signUp = false;
    app.forgotPass = false;
    app.confirm = false;
    app.login = {
        signInEmail: 'alan.ball@outlook.com',
        signInPass: 'pass13245'
    };
    app.loader = false;
    app.alert = {
        header: 'Error',
        text: '123'
    };

    app.toggleSignUp = function(){
        app.signUp = !app.signUp;
    };

    app.toggleForgotPass = function(){
        app.forgotPass = !app.forgotPass;
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

    app.showSignInForm = function(signIn, forgotPass, confirm){
        return signIn || forgotPass || confirm;
    };

    app.showSignUpForm = function(signIn, confirm){
        return !signIn || confirm;
    };

    app.signInSubmit = function(){
        var email = document.getElementById('signInEmail');
        var pass = document.getElementById('signInPass');

        app.loader = true;

        if(email.validate() && pass.validate()){
            app.method = 'POST';
            app.body = JSON.stringify({email: app.login.signInEmail, password: app.login.signInPass});
            app.url = app.apiUrl + 'resources/json/login.json';
        }
    };

    app.handleResponse = function(event, details){
        var alert = document.getElementById('alert');

        if(details.response.success){
            app.loader = false;
            app.sessionId = details.response.user.userId;
            localStorage.setItem('sessionId', app.sessionId);
            page('/dashboard');
        } else {
            app.alert.text = 'Wrong login, password or your account has not been verified. Please check the verification email that was sent.';
            alert.open();
        }
        //console.log(details.response);
    };
})();
