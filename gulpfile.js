var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var vendor = require('gulp-concat-vendor');
var gulpOpen = require('gulp-open'); // open a URL in the browser
var less = require('gulp-less');
var path = require('path');
var nodemon = require('gulp-nodemon');

gulp.task('bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest("js/vendor"))
});

gulp.task('less', function () {
    return gulp.src('styles/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('styles'));
});

gulp.task('start', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
});

gulp.task('open', function () {
    gulp.src('index.html')
        .pipe(gulpOpen({
            uri: 'http://localhost:8080',
            app: 'Google Chrome'
        }));
});

gulp.task('default', ['bower', 'less', 'start', 'open']);
