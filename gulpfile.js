var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

gulp.task('js', function() {
    gulp.src(['./public/js/**/*.js', '!./public/minjs/**/*js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/minjs'));
});