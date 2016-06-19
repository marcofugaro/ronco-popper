import gulp from 'gulp';
import runSequence from 'run-sequence';

import config from './../gulpfile.babel';


gulp.task('build', ['clean'], function(cb) {
  
    runSequence(['markup', 'styles', 'browserify', 'images', 'sounds'], cb);
    
});
