'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
const configuration = require('../configuration');
const fs = require('fs');

router.route('/')
    .get((request, response) => {
      let allFiles = [];
      fs.readdir(configuration.dirs.data.path, (err, files) => {
        if (err) {
            response.status(404).end();
            return console.log(err);
        }

        files.forEach(file => {
          allFiles.push(file.replace('.json', ''));
        });
        response.status(200).json(allFiles);
      });
    })
    .put(parseUrlencoded, (request, response) => {
        if (request.body.name.length < 1) {
            response.status(400).end();
            return console.log("Invalid filename");;
        }

        let filename = request.body.name + ".json";
        console.log("Adding file: " + filename);

        // content template
        let content = JSON.stringify({
            "name": request.body.name,
            "content": request.body.content,
            "metadata": {
                "created": +new Date(),
                "modified": +new Date()
            }
        });

        console.log("content: " + content);

        fs.writeFile(configuration.dirs.data.path + filename, content, function(err) {
            if (err) {
                response.status(500).end();
                return console.log(err);
            }
            console.log("Saved file!");
        });

        response.status(201).json(request.body.name);
    });

router.route('/:name')
    .get((request, response) => {
        let filename = request.params.name + '.json';
        console.log("Requested file: " + filename);

        fs.readFile(configuration.dirs.data.path + filename, function(err, content) {
            if (err) {
                response.status(404).end();
                return console.log(err);
            }
            response.status(200).json(JSON.parse(content));
        });
    });

module.exports = router;
