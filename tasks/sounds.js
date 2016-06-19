import gulp from 'gulp';

import config from './../gulpfile.babel';


gulp.task('sounds', function() {

    return gulp.src(config.sounds.src)
        .pipe(gulp.dest(config.sounds.dest));
});
