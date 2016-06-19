import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import sassGlob from 'gulp-sass-glob';

import config from './../gulpfile.babel';


gulp.task('styles', function () {

    return gulp.src(config.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({ 
            outputStyle: 'extended'
        }))
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 9'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.styles.dest));
});
