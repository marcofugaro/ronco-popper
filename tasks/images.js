import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

import config from './../gulpfile.babel';


gulp.task('images', function() {

    return gulp.src(config.images.src)
        .pipe(imagemin({ 
            use: [pngquant()],
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(config.images.dest));
});
