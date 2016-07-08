var path = require('path'),
    express = require('express'),
    dwolla = require('dwolla-v2'),
    dwollaTest = require('./DwollaAPI'),
    app = express();

// Look in '/public' when serving files
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'public/views'));

// Listen on port PORT
var PORT = 3000,
    APP_NAME = "Template App";
app.listen(PORT);
console.log(APP_NAME + " is listening on port " + PORT);




module.exports = app;
