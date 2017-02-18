'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
const parseJSON = bodyParser.json();
const configuration = require('../configuration');
const fs = require('fs');
const file_extension = '.json';

function File(name, content) {
    this.name = name;
    this.content = content;

    this.version = 1;

    let now = new Date();
    this.created = now.toISOString(); // save as UTC, calculate back on client side
    this.modified = now.toISOString();
}

router.route('/')
    .get((request, response) => {
        console.log("Returning all files...");

        let allFiles = [];
        fs.readdir(configuration.dirs.data.path, (err, files) => {
            if (err) {
                response.status(404).end();
                return console.log(err);
            }

            if (request.query.filter != undefined) {
                console.log("Filtering by: " + request.query.filter);
                let regexp = new RegExp(request.query.filter, 'i', 'g');
                files.forEach(file => {
                    let name = file.replace(file_extension, '');
                    let match = name.match(regexp);
                    if (match != null && match.length > 0) {
                        allFiles.push(name);
                    }
                });
            } else {
                files.forEach(file => {
                    allFiles.push(file.replace(file_extension, ''));
                });
            }

            response.status(200).json(allFiles);
        });
    })
    .put(parseUrlencoded, (request, response) => {
        if (request.body.name.length < 1) {
            response.status(400).json(request.body.name).end();
            return console.log("Invalid filename");
        }

        let filename = request.body.name + file_extension;

        fs.stat(configuration.dirs.data.path + filename, function(err, stats) {
            if (err == null) {
                response.status(409).json(request.body.name).end();
                return console.log("File exists: " + filename);
            } else {
                console.log("Adding file: " + filename);

                // content template
                let content = JSON.stringify(
                    new File(request.body.name, request.body.content));

                console.log("content: " + content);

                fs.writeFile(configuration.dirs.data.path + filename, content, function(err) {
                    if (err) {
                        response.status(500).json(request.body.name).end();
                        return console.log(err);
                    }
                    console.log("Saved file!");
                });

                response.status(201).json(request.body.name);
            }
        });
    });

router.route('/:name')
    .get((request, response) => {
        let filename = request.params.name + file_extension;
        console.log("Requested file: " + filename);

        fs.readFile(configuration.dirs.data.path + filename, function(err, content) {
            if (err) {
                response.status(404).end();
                return console.log(err);
            }
            response.status(200).json(JSON.parse(content));
        });
    })
    .post(parseJSON, (request, response) => {
        let filename = request.params.name + file_extension;
        console.log("Updating file: " + filename);
        console.log('properties: ' + JSON.stringify(request.body));

        if (request.body.length < 1) {
            response.status(400).json(request.body).end();
            return console.log("Nothing to update.");
        }

        fs.readFile(configuration.dirs.data.path + filename, function(err, content) {
            if (err) {
                response.status(404).end();
                return console.log(err);
            }

            content = JSON.parse(content);
            for (let i in request.body) {
                let property = request.body[i];
                for (let p in property) {
                    content[p] = property[p];
                }
            }

            content.modified = new Date().toISOString();
            fs.writeFile(configuration.dirs.data.path + filename, JSON.stringify(content), function(err) {
                if (err) {
                    response.status(500).json(request.body.name).end();
                    return console.log(err);
                }

                console.log("Saved file!");
            });

            response.status(200).json(content);
        });
    });

module.exports = router;
