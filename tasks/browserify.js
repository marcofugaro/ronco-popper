import gulp from 'gulp';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import notify from 'gulp-notify';
import uglify from 'gulp-uglify';

import config from './../gulpfile.babel';


gulp.task('browserify', function() {

    return browserify({
            entries: [config.browserify.src],
            debug: true,
        })
        .transform('babelify', { 'presets': ['es2015', 'stage-1'] })
        .bundle()
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(source(config.browserify.bundleName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.browserify.dest));
});
