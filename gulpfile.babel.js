import gulp from 'gulp';
import fs from 'fs';


const sourceDir = './app/';
const buildDir = './build/';

const config = {
    sourceDir,
    buildDir,

    markup: {
        src: [sourceDir + '*.*'],
        dest: buildDir,
    },

    styles: {
        src: sourceDir + 'sass/**/*.scss',
        dest: buildDir + 'css',
    },

    browserify: {
        src: sourceDir + 'js/main.js',
        dest: buildDir + 'js',
        bundleName: 'main.min.js'
    },

    images: {
        src: sourceDir + 'images/**/*',
        dest: buildDir + 'images'
    },

    sounds: {
        src: sourceDir + 'sounds/**/*',
        dest: buildDir + 'sounds'
    }

};

export default config;

//TODO use requiredir
const tasks = fs.readdirSync('./tasks');
tasks.forEach(function(task) {
    if(task.slice(-3) === '.js') require('./tasks/' + task);
});

gulp.task('default', ['build']);