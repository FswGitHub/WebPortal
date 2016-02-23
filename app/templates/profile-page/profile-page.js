(function (){
    var userDataCopy;
    app.userData = app.sessionId ? JSON.parse(localStorage.getItem(app.apiUrl+ 'user')) : null;
    app.userPhoto = app.userData && app.userData.photo ? 'assets/' + app.userData.photo : null;
    app.showEdit = false;

    app.toggleProfileChanging = function(){
        if(app.showEdit){
            app.userData = userDataCopy;
            app.userPhoto = app.userData && app.userData.photo ? 'assets/' + app.userData.photo : null;
            cleanForm('.profile-fields');
        }
        return app.showEdit = !app.showEdit;
    };

    app._showEditChanged = function(newVal){
        if(newVal){
            var uploader  = document.querySelector('#uploader');
            userDataCopy = (JSON.parse(JSON.stringify(app.userData))); //create a copy of object
            uploader.addEventListener('change', function(e){
                var image = e.target.files[0];
                var reader = new FileReader();
                var dataUrl = reader.readAsDataURL(image);

                reader.onload = function(img) {
                    var newImage = new Image();
                    newImage.src = img.target.result;
                    newImage.onload = function () {
                        if(newImage.width == 200 && newImage.height == 200){
                            app.userPhoto = newImage.src;
                            uploader.value = null;
                            //should be image upload here!
                            // newImage = upload.response.url;
                        } else {
                            showAlert('Wrong size', 'Please choose image 200px x 200px');
                        }
                    };
                };
            }, false);
        }
    };

    app.saveProfileChanges = function(){
        var form = document.querySelectorAll('.profile-fields')[0];
        var fields =  form.querySelectorAll('paper-input');
        var url = app.apiUrl + 'resources/json/editprofile.json';
        var body = {
            userId: app.sessionId,
            //uncomment when image upload will be ready
            //photo: newImage ? newImage : app.userData.photo
            photo: app.userData.photo
        };

        for(var i = 0; i < fields.length; i++){
           if(fields[i].validate()){
               body[fields[i].name] = fields[i].value;
               if(i == fields.length - 1){
                   sendRequest(url, 'POST', body, function(e){
                       if(e.detail.response.success){
                           app.userData = e.detail.response.user;
                           if(app.rememberMe) {
                               localStorage.setItem(app.apiUrl + 'user', JSON.stringify(app.userData));
                           }
                           return app.showEdit = !app.showEdit;
                       } else {
                           showAlert('Error', 'Saving error');
                       }
                   });
               }
           } else {
               break;
           }
        }
    };
})();
