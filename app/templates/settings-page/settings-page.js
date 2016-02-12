(function(){
    var newLogo;
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

    app._themeChanged = function(newVal){
        var saved = localStorage.getItem(app.apiUrl + 'theme');
        if(newVal != saved){
            saveSettings();
        }
    };

    app.saveSettings = function(){
        saveSettings();
    };

    app.recolorApp = function(e){
        app.appColor = e.detail.color;
        return saveSettings();
    };

    app.convertColor = function(hex){
        var RGB = {};

        function toR(h) { return parseInt((cutHex(h)).substring(0,2),16) }
        function toG(h) { return parseInt((cutHex(h)).substring(2,4),16) }
        function toB(h) { return parseInt((cutHex(h)).substring(4,6),16) }
        function cutHex(h) { return (h.charAt(0)=="#") ? h.substring(1,7) : h}

        if(hex){
            RGB.red = toR(hex);
            RGB.green = toG(hex);
            RGB.blue = toB(hex);
        }

        return RGB;
    };

    app.listenForLogoChange = function(){
        setTimeout(function(){
            var logoUploader = document.querySelector('#logoUploader');

            logoUploader.addEventListener('change', function(e){
                var image = e.target.files[0];
                var reader = new FileReader();

                reader.onload = function(img) {
                    newLogo = new Image();
                    newLogo.src = img.target.result;
                    if(newLogo.width <= 224 && newLogo.height <= 64){
                        app.logo = newLogo.src;
                        logoUploader.value = null;
                        //should be logo upload here!
                        // newLogo = upload.response.url;
                    } else {
                        showAlert('Wrong size', 'Please choose image with max size 224px x 64px');
                    }
                };
                reader.readAsDataURL(image);
            });
        });
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

    app.cleanDialog = function(){
        cleanForm('.add-user-form', true);
    };

    app.listenForFile = function(e){
        var fileInput = e.currentTarget.querySelector('#fileInput');
        var dropZone = e.currentTarget.querySelector('#dropZone');
        var output = e.currentTarget.querySelector('#output');

        fileInput.addEventListener('change', function(e){
            var file = e.target.files[0];
            readFile(file, output, function(u){
                usersToUpload = u;
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
        if(user.userId == app.sessionId){
            showAlert('Error', 'You already login!');
        } else {
            app.sessionId = user.userId;
            loadAllData(user.userId);
        }
    };
})();

function cleanCharts(){
    var chartsList = document.querySelectorAll('charts-list');
    for(var i=0; i< chartsList.length; i++){
        chartsList[i].charts = [];
    }
}

function saveSettings(){
    var url = app.apiUrl + 'resources/json/savesettings.json';
    var body = {colour: app.color, logo: app.logo, theme: app.theme};
    for (var key in app.settings){
        body[key] = app.settings[key];
    }

    sendRequest(url, 'POST', body, function(e){
        if(e.detail.response.success){
            if(app.rememberMe){
                localStorage.setItem(app.apiUrl+ 'app_colour', app.appColor ? app.appColor : '#DD1F29');
                localStorage.setItem(app.apiUrl + 'theme', app.theme);
                localStorage.setItem(app.apiUrl + 'logo', app.logo);
                localStorage.setItem(app.apiUrl+ 'settings', JSON.stringify(app.settings));
            }
        } else {
            showAlert('Server error', 'There was an error saving the data.');
        }
    })
}
