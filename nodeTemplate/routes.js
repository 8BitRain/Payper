var app = require('./server'),
    dwollaTest = require('./DwollaAPI'),
    bodyParser = require('body-parser');
    request = require('request');
    querystring = require('querystring');



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
      console.log("Dwolla Test Token: " + token);
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
    var formData = {
          "client_id": "a250b344-844d-41e1-80c0-211f196e50a7",
          "client_secret": "iT0wOcOC3Qj0921eYkJUxNfwBkB0ca5l2Ntv3rFekaoymQwEaa",
          "code": code,
          "grant_type": "authorization_code",
          "redirect_uri": "https://localhost:3000/dwollaView",

    }
          //url='https://uat.dwolla.com/oauth/v2/token'
          //headers:{'Content-Type': 'application/x-www-form-urlencoded'}
          //headers={'Content-Type': 'application/json header'}

          /*request.post(url, options, function(error, response, body){
            if(!error && response.statusCode == 200){
              console.log("Response: " + JSON.stringify(response));
              console.log("Error: " + JSON.stringify(error));
              console.log()
            }
          });*/

          request({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            uri: url,
            body: formData,
            method: 'POST'
          }, function (error, response, body) {
              if(!error && response.statusCode == 200){
                console.log("Response: " + JSON.stringify(response));
                console.log("Error: " + JSON.stringify(error));
                //console.log()
              }
          });
          //console.log("Routes - get_tokens: " + JSON.stringify(get_tokens));
      res.json(customerToken);
  });
});

app.get('/exchangeToken', function(req, res){
  console.log("/exchangeToken recieved code value of: " + req.query.code);
  var code = req.query.code;
  var form = {
        "client_id": "kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp",
        "client_secret": "QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP",
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": "https://localhost:3000/dwollaView",
  }

  console.log(typeof code);

  var form2 = {
    "client_id": "kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp",
    "client_secret": "QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP",
    "grant_type": "client_credentials"
  }
  //var formData = querystring.stringify(form);
  //formData = form;
  //var contentLength = formData.length;
  // https://www.dwolla.com/oauth/v2/token with grant_type=authorization_code&code=auth_code_here&client_id=your_client_id&client_secret=your_client_secret
  url='https://uat.dwolla.com/oauth/v2/token'
        request({
          //headers:{ 'Authorization': 'Bearer UDSyNb8pbj1vCk7t9CkllWRUEkgP5nlgDU9tsvsmAh2Lt02QpE', 'Content-Type': 'application/json'},
          headers:{'Content-Type': 'application/json'},
          uri: url,
          json: true,
          body: form,
          method: 'POST'
        }, function (error, response, body) {
            if(!error && response.statusCode == 200){
              console.log("Response: " + JSON.stringify(response));
              console.log("Error: " + JSON.stringify(error));
              console.log("Body: " + JSON.stringify(body));
            } else {
              console.log("Response: " + JSON.stringify(response));
              console.log("Error: " + JSON.stringify(error));
            }
        });

  res.json("Response from server: " + code);

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
