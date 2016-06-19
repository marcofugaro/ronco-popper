import gulp from 'gulp';
import fs from 'fs';
import { assign } from 'lodash';


const config = {
    sourceDir: './app/',
    buildDir: './build/',
};

assign(config, {

    markup: {
        src: [config.sourceDir + '*.*'],
        dest: config.buildDir,
    },

    styles: {
        src: config.sourceDir + 'sass/**/*.scss',
        dest: config.buildDir + 'css',
    },

    browserify: {
        src: config.sourceDir + 'js/main.js',
        dest: config.buildDir + 'js',
        bundleName: 'main.min.js'
    },

    images: {
        src: config.sourceDir + 'images/**/*',
        dest: config.buildDir + 'images'
    },

    sounds: {
        src: config.sourceDir + 'sounds/**/*',
        dest: config.buildDir + 'sounds'
    }

});

export default config;


const tasks = fs.readdirSync('./tasks');
tasks.forEach(function(task) {
    if(task.slice(-3) === '.js') require('./tasks/' + task);
});

gulp.task('default', ['build']);