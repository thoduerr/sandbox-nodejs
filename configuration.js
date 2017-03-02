'use strict';

const fs = require('fs');
const path = require('path');

function Directory(name, path) {
    this.name = name;
    this.path = path;
}

const dirs = {
    pub: new Directory('public', path.join(__dirname, 'public')),
    data: new Directory('data', path.join(__dirname, 'data')),
    js: {
        jquery: new Directory('jquery', path.join(__dirname, 'node_modules/jquery/dist')),
        bootstrap: new Directory('bootstrap', path.join(__dirname, 'node_modules/bootstrap/dist/js'))
    },
    css: {
        bootstrap: new Directory('bootstrap', path.join(__dirname, 'node_modules/bootstrap/dist/css'))
    },
    fonts: {
        bootstrap: new Directory('bootstrap', path.join(__dirname, 'node_modules/bootstrap/dist/fonts'))
    }
};

function ensureDirectoryExists(directory) {
    fs.stat(directory.path, function(err, stats) {
        if (err) {
            fs.mkdir(directory.path, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The '" + directory.name + "' directory has been created!");
            });
        } else {
            console.log("The '" + directory.name + "' directory exists!");
        }
    });
}

module.exports = {
    url: 'localhost',
    port: '6000',
    dirs: dirs,
    setup: function() {
        ensureDirectoryExists(dirs.data);
    }
};
