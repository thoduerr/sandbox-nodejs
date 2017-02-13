'use strict';

const fs = require('fs');
const path = require('path');

function Directory(name, path) {
  this.name = name;
  this.path = path;
}

const root = new Directory('root', __dirname + "/");
const pub = new Directory('public', __dirname + "public/");
const data = new Directory('data', root.path + 'data/');

const dirs = {
    root: root,
    pub: pub,
    data: data
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
