'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const express = require('express');

const path = require('path');

const configuration = require('./configuration');
const renderer = require('./lib/render');

const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({
  extended: false
});

configuration.setup();

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
app.listen(configuration.port, () => {
  // Mean to console.log out, so disabling
  console.log(`Server starting on ${configuration.url}`); // eslint-disable-line no-console
});
