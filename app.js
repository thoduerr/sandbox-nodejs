'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const express = require('express');
const renderer = require('./lib/render');
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

const path = require('path');
const configuration = require('./configuration');
configuration.setup();

//////////////////////////////
// App Variables
//////////////////////////////
const app = express();

app.engine('html', renderer);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// redirect to nodejs library
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// routes
const files = require('./routes/files');
app.use('/files', files);
// create a new route for each resource...

app.get('/', (request, response) => {
  response.render('index');
});

//////////////////////////////
// Start the server
//////////////////////////////
app.listen(configuration.port, () => {
  // Mean to console.log out, so disabling
  console.log(`Server starting on ${configuration.url}`); // eslint-disable-line no-console
});
