var app = require('./server'),
    dwollaTest = require('./DwollaAPI'),
    bodyParser = require('body-parser');


// Let EJS drive views
app.set("view engine", "ejs");

// Parse POST bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());;

// Landing page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// Send POST request here
app.get('/xyz', function(req, res) {
  res.render('pages/xyz');
});

//Test Dwolla bank information
app.get('/dwollaView', function(req, res) {
  var customerToken;
  res.render('pages/dwollaView', {
    token: customerToken
  });
});

app.get('/simpleListen', function(req, res){
  var customerToken;
  dwollaTest.run(function(token){
      //callback goes here
      console.log("Dwolla Test Token: " + token);
      var client = require('swagger-client');
      var dwolla = new client({
          url: 'https://api-uat.dwolla.com/swagger.json',
          authorizations: {
              dwollaHeaderAuth: new client.ApiKeyAuthorization('Authorization', token, 'header')
          },
          usePromise: true
      });
      customerToken = token;
      res.json(customerToken);
  });
});

// Receive POST request here
app.post('/post', function(req, res) {
  var message = req.body.message;

  dwollaTest.run(function(token){
      //callback goes here
      console.log("Dwolla Test Log: " + token);
      res.send("Received message: " + token);
  });

});



module.exports = app;
