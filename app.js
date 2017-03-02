'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const express = require('express');
const renderer = require('./lib/render');


const configuration = require('./configuration');
configuration.setup();

//////////////////////////////
// App Variables
//////////////////////////////
const app = express();

app.engine('html', renderer);
app.set('view engine', 'html');

app.use(express.static(configuration.dirs.pub.path));

// redirect to nodejs modules
app.use('/js', express.static(configuration.dirs.js.jquery.path)); // redirect JS jQuery
app.use('/js', express.static(configuration.dirs.js.bootstrap.path)); // redirect bootstrap JS
app.use('/css', express.static(configuration.dirs.css.bootstrap.path)); // redirect CSS bootstrap
app.use('/fonts', express.static(configuration.dirs.fonts.bootstrap.path)); // redirect CSS bootstrap

// routes
const files = require('./routes/files');
app.use('/files', files);
// add a new route for each resource...

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
