var gulp = require('gulp'),
    bower = require('bower'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename');

var paths = {
    app:    './app',
    dist:   './resources/dist',
    sass:   './resources/scss/**/*.scss'
};

gulp.task('default', ['sass']);
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    //gulp.watch(paths.js, ['lint', 'js']);
});
gulp.task('sass', function(ready) {
    gulp.src('./resources/scss/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'app/css',
            sass: 'resources/scss'
        }))
        .pipe(minifyCss({
            //keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./app/css/'))
        .on('error', function(error) {
            console.log(error);
            this.emit('end');
        })
        .on('end', ready);
});

gulp.task('install', function(){
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});