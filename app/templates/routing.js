window.addEventListener('WebComponentsReady', function () {
    // Removes end / from app.baseUrl which page.base requires for production
    if (window.location.port === '') {  // if production
        page.base(app.baseUrl.replace(/\/$/, ''));
    }

    // Middleware
    function scrollToTop(ctx, next) {
        app.scrollPageToTop();
        next();
    }

    function closeDrawer(ctx, next) {
        app.closeDrawer();
        next();
    }

    // Routes
    page('*', scrollToTop, closeDrawer, function (ctx, next) {
        next();
    });

    page('/', function () {
        page('/login');
    });

    page('/login', function (ctx) {
        var token = false;
        //var reset = false;
        var queryString = ctx.querystring;

        if(app.sessionId){
            page('/dashboard');
        } else {
            if (queryString.length > 0) {
                if (queryString.match(new RegExp('^token='))) {
                    token = queryString.replace('token=', '');
                    //token validation here
                }
            }

            app.route = {
                name: 'login',
                main: false,
                verify: token
                //reset: reset
            }
        }
    });

    page('/signup', function () {
        if (app.sessionId) {
            page('/dashboard');
        } else {
            app.route = {
                name: 'signup',
                main: false
            }
        }
    });

    page('/forgotpass', function () {
        if (app.sessionId) {
            page('/dashboard');
        } else {
            app.route = {
                name: 'forgotpass',
                main: false
            }
        }
    });

    page('/reset', function (ctx) {
        var resetValue = false;
        var queryString = ctx.querystring;
        if (queryString.match(new RegExp('^resetValue='))) {
            resetValue = queryString.replace('resetValue=', '');
        }
        if (app.sessionId) {
            page('/dashboard');
        } else {
            app.route = {
                name: 'reset',
                main: false,
                resetValue: resetValue
            }
        }
    });

    page('/confirm', function () {
        if (app.sessionId) {
            page('/dashboard');
        } else {
            app.route = {
                name: 'confirm',
                main: false
            }
        }
        setTimeout(function () {
            page('/login');
        }, 5000);
    });

    page('/dashboard', function () {
        if (app.sessionId) {
            app.route = {
                name: 'dashboard',
                main: true
            }
        } else {
            page('/login');
        }
    });
    page('/portfolio', function () {
        if(app.sessionId){
            app.route = {
                name: 'portfolio',
                main: true
            }
        } else {
            page('/login');
        }
    });
    page('/portfolio/:id/:tab', function (data) {
        if(app.sessionId){
            app.portfolioTab = data.params.tab;
            app.route = {
                name: 'portfolio-item-'+data.params.id,
                params: data.params,
                main: true
            }
            app.cleanSearch();
        } else {
            page('/login');
        }
    });
    page('/profile', function () {
        if(app.sessionId){
            app.route = {
                name: 'profile',
                main: true
            }
        } else {
            page('/login');
        }
    });
    page('/settings/:tab', function (data) {
        if(app.sessionId){
            app.settingsTab = data.params.tab;
            app.route = {
                name: 'settings',
                main: true,
                params: data.params
            }
        } else {
            page('/login');
        }
    });
    // 404
    page('*', function (ctx) {
        var queryString = ctx.querystring;
        if(queryString){
            page.redirect('/login?' + queryString);
        } else {
            page.redirect('/login');
        }

    });
    // add #! before urls
    page({
        hashbang: true
    });
});
