const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const argv = require('yargs').argv
const jslint = require('gulp-jslint');
const browserSync = require('browser-sync').create();

const staticSite = "./static";

const paths = {
  scripts: [],
  html: [staticSite+'/*.html',staticSite+'/**/*.html'],
  styles: ['./src/scss/*.scss']
};

gulp.task('sass', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static/-/media/Themes/superAwesomeTheme/styles/'))
});
gulp.task('sass-compiled', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./static/-/media/Themes/superAwesomeTheme/styles/'))
});

gulp.task('js-compiled', function(){
    return gulp.src('./src/scripts/*.js')
        .pipe(jslint({
            /* this object represents the JSLint directives being passed down */ 
            global:['SXA_theme'],
            devel:true
        }))
        .pipe(jslint.reporter( 'stylish'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./'+ argv.theme +'/'))
});

gulp.task('watch', function() {
  gulp.watch(paths.styles, ['sass-compiled']);
});

// Static server
gulp.task('serve', ['sass'],function() {
    browserSync.init({
        server: {
            baseDir: staticSite+'/'
        }
    });

    gulp.watch(paths.styles, ['sass']).on('change', browserSync.reload);
    gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('serve-compiled', ['sass-compiled'],function() {
    browserSync.init({
        server: {
            baseDir: staticSite+'/'
        }
    });

    gulp.watch(paths.styles, ['sass-compiled']).on('change', browserSync.reload);
    gulp.watch(paths.html).on('change', browserSync.reload);
});


gulp.task('default', ['watch']);