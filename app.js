'use strict';

//////////////////////////////
// requestuiresponse
//////////////////////////////
const express = require('express');

const path = require('path');

const appEnv = require('./lib/env');
const renderer = require('./lib/render');

const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

const fs = require('fs');
fs.stat(appEnv.dataDirectory, function(err, stats) {
  if (err) {
    fs.mkdir(appEnv.dataDirectory, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The '" + appEnv.dataDirectory + "' directory has been created!");
    });
  } else {
    console.log("The '" + appEnv.dataDirectory + "' directory exists!");
  }
});

//////////////////////////////
// App Variables
//////////////////////////////
const app = express();

app.engine('html', renderer);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// routes
const files = require('./routes/files');
app.use('/files', files);
// for each resource...

app.get('/', (request, response) => {
  response.render('index');
});

//////////////////////////////
// Start the server
//////////////////////////////
app.listen(appEnv.port, () => {
  // Mean to console.log out, so disabling
  console.log(`Server starting on ${appEnv.url}`); // eslint-disable-line no-console
});
