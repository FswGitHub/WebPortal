(function (){
    var app = document.querySelector('#app');
    // Sets app default base URL
    app.baseUrl = '/';
    app.mainColor = 'green';
    app.signUp = false;
    app.forgotPass = false;
    app.confirm = false;

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

    app.addClass = function(variable, classString){
        if(variable){
            return classString
        }
    };

    app.rememberMeSave = function(){
        console.log(app.rememberMe);
    };

    window.addEventListener('WebComponentsReady', function (e) {
         //console.log(app.currentStyle);
         //if (app.mainColor) {
         //app.customStyle['--paper-input-container-focus-color'] = app.mainColor;
         //app.updateStyles();
         //}
     });
    //if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    //app.baseUrl = '/Fundamental v.2/';
    //}
})();
