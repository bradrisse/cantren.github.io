var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var vendor = require('gulp-concat-vendor');

gulp.task('bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest("js/vendor"))
});