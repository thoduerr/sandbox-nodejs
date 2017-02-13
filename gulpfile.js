'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sasslint = require('gulp-sass-lint');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

//////////////////////////////
// Variables
//////////////////////////////
const dirs = {
    js: {
        lint: {
            browser: [
                'src/**/*.js',
                '!src/**/*.min.js'
            ],
            node: [
                'index.js',
                'lib/**/*.js',
            ],
        },
        uglify: [
            'src/js/**/*.js',
            '!src/js/**/*.min.js'
        ]
    },
    server: {
        main: 'app.js',
        watch: [
            'app.js',
            'lib',
            'views',
            'routes'
        ],
        extension: 'js html',
    },
    sass: 'src/sass/**/*.scss',
    images: 'src/images/**/*.*',
    public: 'public/'
};

const sassOptions = {
    'outputStyle': 'expanded'
};

//////////////////////////////
// Sass Tasks
//////////////////////////////
gulp.task('sass', function() {
    return gulp.src(dirs.sass)
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dirs.public + 'css'))
        .pipe(browserSync.stream());
});

gulp.task('sass:watch', function() {
    return gulp.watch(dirs.sass, ['sass']);
});

gulp.task('uglify', function() {
    return gulp.src(dirs.js.uglify)
        .pipe(gulp.dest(dirs.public + 'js'))
        .pipe(browserSync.stream());
});

gulp.task('uglify:watch', function() {
    return gulp.watch(dirs.js.uglify, ['uglify']);
});

//////////////////////////////
// Image Tasks
//////////////////////////////
gulp.task('images', function() {
    return gulp.src(dirs.images)
        .pipe(imagemin({
            'progressive': true,
            'svgoPlugins': [{
                'removeViewBox': false
            }]
        }))
        .pipe(gulp.dest(dirs.public + '/images'));
});

gulp.task('images:watch', function() {
    return gulp.watch(dirs.images, ['images']);
});

//////////////////////////////
// Nodemon Task
//////////////////////////////
gulp.task('nodemon', function(cb) {
    nodemon({
            script: dirs.server.main,
            watch: dirs.server.watch,
            env: {
                'NODE_ENV': 'development'
            },
            ext: dirs.server.extension
        })
        .once('start', function() {
            cb();
        })
        .on('restart', function() {
            setTimeout(function() {
                browserSync.reload();
            }, 500);
        });
});

//////////////////////////////
// Browser Sync Task
//////////////////////////////
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        'proxy': 'localhost:6000'
    });
});

//////////////////////////////
// Running Tasks
//////////////////////////////
gulp.task('build', ['uglify', 'sass', 'images']);

gulp.task('test', ['build']);

gulp.task('watch', ['uglify:watch', 'sass:watch', 'images:watch']);

gulp.task('default', ['browser-sync', 'build', 'watch']);
