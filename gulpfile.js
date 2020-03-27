const gulp = require('gulp');
const mincssmin = require('gulp-minify-css');
const concat = require('gulp-concat');
const autoprefix = require('gulp-autoprefixer');
const uglifyjs = require('gulp-uglifyjs');
const browserSync = require('browser-sync').create();

const config = {
    srcStylePath: 'src/style',
    srcJsPath: 'src/js',
    distStylePath: 'dist/style',
    distJsPath: 'dist/js'
};

gulp.task('other', () => {
    gulp.src([
        'src/**/*.*', 
        '!' + config.srcStylePath + '/*',
        '!' + config.srcJsPath + '/*'
    ])
        .pipe(gulp.dest('dist/'));
});

gulp.task('style', () => {
    gulp.src(config.srcStylePath + '/**/*.css')
        .pipe(autoprefix([
            "> 1%",
            "IE 10"
        ]))
        .pipe(concat('main.css'))
        .pipe(mincssmin())
        .pipe(gulp.dest(config.distStylePath))
});

gulp.task('scripts', () => {
    gulp.src(config.srcJsPath + '/**/*.js')
        .pipe(uglifyjs({
            mangle: {
                toplevel: true
            }
        }))
        .pipe(concat('main-bundle.js'))
        .pipe(gulp.dest(config.distJsPath))
});

gulp.task('style-watch', ['style'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('scripts-watch', ['scripts'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('other-watch', ['other'], (done) => {
    browserSync.reload();
    done();
});

gulp.task('watch', ['style', 'scripts', 'other'], () => {
    browserSync.instance = browserSync.init({
        server: "./dist",
        debugInfo: true,
        open: true
    });
 
    gulp.watch(config.srcStylePath + '/**/*.css', ['style-watch']);
    gulp.watch(config.srcJsPath + '/**/*.js', ['scripts-watch']);
  
    gulp.watch([
        'src/**/*', 
        '!' + config.srcStylePath + '/**/*.css',
        '!' + config.srcJsPath + '/**/*.js'
    ], ['other-watch']);
});
