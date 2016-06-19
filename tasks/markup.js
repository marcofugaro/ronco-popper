import gulp from 'gulp';

import config from './../gulpfile.babel';


gulp.task('markup', function() {

  return gulp.src(config.markup.src, { base: config.sourceDir, dot: true })
    .pipe(gulp.dest(config.markup.dest));
});
