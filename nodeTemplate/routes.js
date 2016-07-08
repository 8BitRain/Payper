var app = require('./server'),
    dwollaTest = require('./DwollaAPI'),
    bodyParser = require('body-parser');
    request = require('request');



var globalCode;
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
  var code;

  console.log("Request Query: " + JSON.stringify(req.query));
  //Retrieve token code from Dwolla API. On redirect dwollaView will have a code query appended after ?
  if(req.query.code != null) code = req.query.code;
  else console.log("Request query has no code component!");
  //Fake code = http://localhost:3000/dwollaView?code=YoJNSxHq9blORyR0bY0FagX5C20O


  res.render('pages/dwollaView', {
    code: code
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

      console.log("Beginning handshake with Dwolla");
      /*request.post(
        'https://uat.dwolla.com/oauth/v2/' + customerToken
        ,
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Body Response:" + body)
            } else {
              console.log("ERROR: " + error);
              console.log("RESPONSE: " + response);
              console.log("BODY: " + body);
            }
        }
    );*/
        par={
          "client_id": "812-123-5128",
          "client_secret": "R5SxRFo9jzD7RflrdlHc9KXH790v0Jkd8QIX3utuvcZRgOMkOa",
          "code": "8HqdIM3aWGiM5fKW0iEUvnYeJlrP",
          "grant_type": "authorization_code",
          "redirect_uri": "https://localhost:8000/polls/redirect"
          }
          url='https://uat.dwolla.com/oauth/v2/token'
          headers={'Authorization': 'Bearer pLhLWet9AyuRgghBeU0cyHB3nfGEJFoGqyiddsIhYxF7eZ3hTT', 'Content-Type': 'application/vnd.dwolla.v1.hal+json', 'Accept': 'application/vnd.dwolla.v1.hal+json'}

          get_tokens=requests.post(url=url, params=par, headers=headers)
      res.json(customerToken);
  });
});

app.get('/exchangeToken', function(req, res){
  console.log("/exchangeToken recieved code value of: " + req.query.code);
  var testVar = "Music";
  request.post(
    'https://uat.dwolla.com/oauth/v2/' + req.query.code,
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Body Response:" + body)
        } else {
          console.log("ERROR: " + error);
          console.log("RESPONSE: " + response);
          console.log("BODY: " + body);
        }
    }
);
  res.json(testVar);

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
