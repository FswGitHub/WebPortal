(function (){
    app.signUp = false;
    app.forgotPass = false;
    app.confirm = false;
    app.login = {
        signIn: {
            email: 'alan.ball@outlook.com',
            pass: 'pass13245'
        }
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
            app.method = 'POST';
            app.body = JSON.stringify({email: app.login.signIn.email, password: app.login.signIn.pass});
            app.url = app.apiUrl + 'resources/json/login.json';
            app.handleResponse = app.signInResponse;
            request.generateRequest();
        }
    };

    app.signInResponse = function(event, details){
        if(details.response.success){
            app.loader = false;
            app.sessionId = details.response.user.userId;
            app.menuSubItems = app.getMenuSubItems();
            if(app.rememberMe){
                localStorage.setItem('sessionId', app.sessionId);
            }
            page('/dashboard');
        } else {
            app.dialog = {
                dismissText: 'OK',
                header: 'Error',
                text: 'Wrong login, password or your account has not been verified. Please check the verification email that was sent.'
            };
            app.loader = false;
            dialog.open();
        }
    };

    app.signUpSubmit = function(){
        var first = document.getElementById('signUpFirstName');
        var last = document.getElementById('signUpLastName');
        var email = document.getElementById('signUpEmail');
        var pass = document.getElementById('signUpPass');

        if(first.validate() && last.validate() && email.validate() && pass.validate()){
            app.method = 'POST';
            app.body = JSON.stringify({
                firstName: app.login.signUp.firstName,
                lastName: app.login.signUp.lastName,
                email: app.login.signUp.email,
                password: app.login.signUp.pass
            });
            app.url = app.apiUrl + 'resources/json/signup.json';
            app.handleResponse = app.signUpResponse;
            request.generateRequest();
        }
    };

    app.signUpResponse = function(event, details){
        if(details.response.success){
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
    };

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
