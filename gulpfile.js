var gulp = require('gulp'),
    paths = {
        src: 'src/**/*',
        srcHTML: 'src/**/*.html',
        srcCSS: 'src/**/*.css',
        srcJS: 'src/**/*.js',
        srcIndex: 'src/index.html',

        dist: 'dist',
        distIndex: 'dist/index.html',
        distCSS: 'dist/**/*.css',
        distJS: 'dist/**/*.js'
    },
    inject = require('gulp-inject'),
    webserver = require('gulp-webserver'),
    htmlclean = require('gulp-htmlclean'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');





gulp.task('inject', function () {
    var sources = gulp.src([paths.srcCSS, paths.srcJS], { read: false });
    return gulp.src(paths.srcIndex)
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./src'));
});

gulp.task('serve', ['inject'], function () {
    return gulp.src('./src')
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['watch']);

gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
    return gulp.src(paths.srcCSS)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
    return gulp.src(paths.srcJS)
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);
gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['inject:dist']);

gulp.task('serve:dist', ['inject'], function () {
    return gulp.src(paths.dist)
        .pipe(webserver({
            port: 4000,
            livereload: true
        }));
});