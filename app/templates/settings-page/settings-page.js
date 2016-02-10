(function(){
    var usersToUpload;

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

    app._mainColorChanged = function(newVal, oldVal){

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
                    localStorage.setItem(app.apiUrl+ 'users', JSON.stringify(app.users));
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
    };

    app.listenForFile = function(e){
        var fileInput = e.currentTarget.querySelector('#fileInput');
        var dropZone = e.currentTarget.querySelector('#dropZone');
        var output = e.currentTarget.querySelector('#output');

        fileInput.addEventListener('change', function(e){
            var file = e.target.files[0];
            readFile(file, output, function(u){
                usersToUpload = u;
                console.log(usersToUpload);
            });
        }, false);

        dropZone.addEventListener('dragover', function(e){
            e.stopPropagation();
            e.preventDefault();
        }, false);

        dropZone.addEventListener('drop', function(e){
            e.stopPropagation();
            e.preventDefault();

            var file = e.dataTransfer.files[0];
            readFile(file, output, function(u){
                usersToUpload = u;
                console.log(usersToUpload);
            });
        }, false);

        function readFile(file, output, callback){
            var name = file.name;
            var xlsx = name.match(/\.(xlsx?)$/);
            var xls = name.match(/\.(xls?)$/);
            var type = xlsx ? XLSX : XLS;

            if(xlsx || xls){
                var reader = new FileReader();

                output.value = name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = type.read(data, {type: 'binary'});
                    var pages = workbook.Sheets;
                    var page = null;
                    for(var key in pages){
                        if(!page && pages[key]){
                            page = type.utils.sheet_to_json(pages[key]);
                        } else {
                            break;
                        }
                    }
                    return callback.call(this, page);
                };
                reader.readAsBinaryString(file);
            } else {
                showAlert('Error', 'Please, choose a .xlsx or .xls file with users!');
            }
        }
    };

    app.uploadUsers = function(e){
        var dialog = e.currentTarget.parentNode.parentNode;
        if(usersToUpload && usersToUpload.length){
            var url = app.apiUrl +'resources/json/uploadusers.json';
            var body = {'success': true, 'users': usersToUpload};
            sendRequest(url, 'POST', body, function(e){
                if(e.detail.response.success){
                    app.users = e.detail.response.users;
                    localStorage.setItem(app.apiUrl+ 'users', JSON.stringify(app.users));
                    dialog.close();
                } else {
                    showAlert('Error', 'Uploading error');
                }
            });
        }
    };

    app.cleanFile = function(e){
        var output = e.currentTarget.querySelector('#output');
        output.value = null;
    };

    app.resendConfirmation = function(e){
        var userId = e.model.item.userId;
        var url = app.apiUrl + 'resources/json/sendconfirmationemail.json';
        var body = {userId: userId};

        if(!userId){
            showAlert('Error', 'User has no id');
        } else {

            sendRequest(url, 'POST', body, function(e){
                if(e.detail.response.success){
                    console.log(e.detail.response);
                    showAlert('Email sent', 'Confirmation email sent');
                } else {
                    showAlert('Error', 'There was an error in sending the confirmation email');
                }
            });
        }
    };

    app.loginAsUser = function(e){
        var user = e.model.item;
        var url = app.apiUrl + 'resources/json/login.json';
        var body = {email: user.email, password: user.password};
        sendRequest(url, 'POST', body, signInResponse);
    };

    app.setColorPicker = function(){
        //setTimeout(function(){
        //    var wrapper = document.querySelectorAll('.color-selector-wrapper')[0];
        //    var oldPicker = wrapper.querySelectorAll('paper-color-input')[0];
        //
        //    if(!oldPicker){
        //        var colorPicker = document.createElement('paper-color-input');
        //        colorPicker.classList.add('color-selector');
        //        colorPicker.shape = 'circle';
        //        colorPicker.type = 'hsv';
        //        colorPicker.value = {red: 221, green: 31, blue: 41};
        //        console.log(colorPicker);
        //        return wrapper.appendChild(colorPicker);
        //    }
        //})
    };
})();

function cleanCharts(){
    var chartsList = document.querySelectorAll('charts-list');
    for(var i=0; i< chartsList.length; i++){
        chartsList[i].charts = [];
    }
}
