var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var jade        = require('gulp-jade');
var del         = require('del');
var reload      = browserSync.reload;

/**
 * Compile jade files into HTML
 */
gulp.task('templates', function() {
    return gulp.src('./app/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
});

/**
 * Important!!
 * Separate task for the reaction to `.jade` files
 */
gulp.task('jade-watch', ['templates'], reload);

/**
 * Sass task for live injecting into all browsers
 */
gulp.task('sass', function () {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({stream: true}));
});

gulp.task('js-watch', function(){
    return gulp.src('./app/**/*.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({stream: true}));
});

gulp.task('copy-bower-components', function(){
    return gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('./dist/bower_components/'));
});

gulp.task('copy-assets', function(){
    return gulp.src(['./app/assets/**', '!./app/assets/components/**', '!./app/assets/components/'])
        .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('copy-components', function(){
    return gulp.src('./app/assets/components/**')
        .pipe(gulp.dest('./dist/bower_components/'));
});

gulp.task('copy-js', function(){
    return gulp.src('./app/**/*.js')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', ['copy-bower-components', 'copy-assets', 'copy-js', 'copy-components']);

// Clean output directory
gulp.task('clean', function() {
    return del('./dist');
});

/**
 * Serve and watch the scss/jade files for changes
 */
gulp.task('default', ['copy', 'sass', 'templates'], function () {

    browserSync({
        //port: 6000,
        //notify: false,
        //logPrefix: 'FWP',
        snippetOptions: {
            rule: {
                match: '<span id="browser-sync-binding"></span>',
                fn: function(snippet) {
                    return snippet;
                }
            }
        },
        server: './dist'
    });

    gulp.watch('./app/scss/**/*.scss', ['sass']);
    gulp.watch('./app/**/*.jade',      ['jade-watch']);
    gulp.watch('./app/**/*.js',        ['js-watch']);
    gulp.watch('./app/bower_components/**', ['copy-bower-components']);
    gulp.watch('./app/assets/**', ['copy-assets']);
});

gulp.task('build', ['clean','copy', 'sass', 'templates'], function () {

    browserSync({server: './dist'});
});
