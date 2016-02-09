(function(){
    app.settings = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'settings')) : null;
    app.users = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'users')) : null;

    app.properties = {
        newUser: {
            type: Object,
            value: {
                email: null,
                firstName: null,
                lastName: null
            }
        }
    };

    app._mainColorChanged = function(){
        //console.log(app.mainColor);
    };

    app.openImportDialog = function(){
        var dialog = document.getElementById('importDialog');
        dialog.open();
    };

    app.openAddUserDialog = function(){
        var dialog = document.getElementById('addUserDialog');
        dialog.open();
    };

    app.addConfirmed = function(e){
        var dialog = e.currentTarget.parentNode.parentNode;
        var email = dialog.querySelector('#newEmail');
        var first = dialog.querySelector('#newFirstName');
        var last = dialog.querySelector('#newLastName');

        if(email.validate() && first.validate() && last.validate()){
            var url = app.apiUrl +'resources/json/adduser.json';
            var body = {email: email.value, firstName: first.value, lastName: last.value};
            sendRequest(url, 'POST', body, function(e){
                if(e.detail.response.success){
                    app.users = e.detail.response.users;
                    dialog.close();
                } else {
                    showAlert('Error', 'Server error');
                }
            });
        }
    };

    app.cleanDialog = function(e){
        var dialog = e.currentTarget;
        var email = dialog.querySelector('#newEmail');
        var first = dialog.querySelector('#newFirstName');
        var last = dialog.querySelector('#newLastName');

        email.invalid = false;
        first.invalid = false;
        last.invalid = false;
        email.value = null;
        first.value = null;
        last.value = null;
    }
})();
