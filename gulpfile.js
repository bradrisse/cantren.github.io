var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var vendor = require('gulp-concat-vendor');
var connect = require('gulp-connect');
var gulpOpen = require('gulp-open'); // open a URL in the browser
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var path = require('path');

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

gulp.task('connect', function () {
    connect.server({
        root: '',
        port: 8000,
        livereload: true
    });
});

var opened = false;
gulp.task('open', function(){
  if (opened == false) {
    gulp.src('index.html')
        .pipe(gulpOpen({uri: 'http://localhost:8000', app: 'Google Chrome'}));
    opened = true;
  }
  else {
    gulp.src("index.html")
    .pipe(livereload());
  }
});

gulp.task('watch', function () {
    gulp.watch(['index.html', 'styles/less/*.less', 'js/app.js'], ['less', 'open']);
});

gulp.task('default', ['bower', 'less', 'connect', 'open', 'watch']);
