//NOTE if the server is running into issues you might need to refresh your sandbox tokens at uat-dwolla.com
var dwolla = require('dwolla-v2'),
    client = new dwolla.Client({id: "kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp", secret: "QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP", environment: 'sandbox',}),
    accountToken = new client.Token({access_token: "9scZQk4eAj2UmikysNYKm5zBJ7Qj5JidPnYlsO84gijNoOHh3F"});

var DwollaAPI = function () {};
DwollaAPI.prototype.account = accountToken;
DwollaAPI.prototype.log = function () {
  console.log('buz!');
};

//1. Generate Credentials
function generateCredentials(){
  var baseUrl = "https://uat.dwolla.com/oauth/v2/authenticate?client_id=",
    clientID = 'kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp',
    responseAndRedirect = "&response_type=code&redirect_uri=",
    scope = "send|transactions|funding|managecustomers",
    //Change this to redirect to server uri
    redirect_uri = 'http://localhost:3000/dwollaView',
    authScope = "&scope=ManageCustomers%7CSend%7CFunding%7CScheduled%7CTransactions";
  var oAuthUrl= baseUrl + encodeURI(clientID + responseAndRedirect + redirect_uri) + authScope;
  //Open up a browser from the server for feedback
  //window.location.href = oAuthUrl;
}

//2. Exchange the token recieved from generated credentials for new access & refresh token
function exchangeToken(){
  var code; //set this equal to the querystring code you recieve ?code=
  var form = {
        "client_id": 'kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp',
        "client_secret": 'QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP',
        "code": code,
        "grant_type": 'authorization_code',
        "redirect_uri": 'http://localhost:3000/dwollaView'
  }

  console.log("accountToken: " +  JSON.stringify(dwollaTest.accountToken));
  url='https://uat.dwolla.com/oauth/v2/token'
        request({
          //headers:{ 'Authorization': 'Bearer 9scZQk4eAj2UmikysNYKm5zBJ7Qj5JidPnYlsO84gijNoOHh3F', 'Content-Type': 'application/json'},
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
              var options = {access_token: body.access_token, refresh_token: body.refresh_token, expires_in: body.expires_in, scope: body.scope, account_id: body.account_id};
              swapAccounts(options);
            } else {
              console.log("Response: " + JSON.stringify(response));
              console.log("Error: " + JSON.stringify(error));
            }
        });
}

//2.5 Swap access keys and refresh keys
DwollaAPI.prototype.swapAccounts = function(options){
  accountToken = new client.Token({access_token: options.access_token, refresh_token: options.refresh_token,
  expires_in: options.expires_in, scope: options.scope , account_id: options.account_id});
}
DwollaAPI.prototype.createVerifiedCustomer = function(callback){
  createVerifiedCustomer(callback);
}

DwollaAPI.prototype.get_IAV = function(callback){
  getIAV(callback);
}

function getIAV(callback){
  //Remy Transistozzy customer ID  = 6dbcad5e-c1f8-4667-aa55-6f3ad3148b3f
  var customerUrl = 'https://api-uat.dwolla.com/customers/' + '6dbcad5e-c1f8-4667-aa55-6f3ad3148b3f' + '/iav-token';
  console.log("customerUrl: " + customerUrl);
  console.log("accountToken Scope: " + accountToken.scope);
  accountToken
    .post(customerUrl)
    .then(function(res) {
      res.body.token; // => 'Z9BvpNuSrsI7Ke1mcGmTT0EpwW34GSmDaYP09frCpeWdq46JUg'
      console.log("iavToken: " + res.body.token);
      callback(res.body.token);
    }).catch(err => console.log('ERROR', JSON.stringify(err)));
}


function createVerifiedCustomer(callback) {

//Format for a verifiedRequest
var verifiedRequest = {
  firstName: 'Remy',
  lastName: 'Transistozzy',
  email: 'b@raan.com',
  type: 'personal',
  address1: '1112 N. Forest Hillszy',
  address2: 'Apt 1E',
  city: 'Madison',
  state: 'WI',
  postalCode:'60637',
  dateOfBirth: "1991-03-25",
  ssn: "9123",
  phone: "2123371442"
};

//Create a customer
accountToken
  .post('customers', verifiedRequest)
  .then(function(res) {
    res.headers.get('location'); // => 'https://api-uat.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
    callback(res.headers.get('location'));
  });
}

module.exports = new DwollaAPI();
module.exports.accountToken = accountToken;
module.exports.client = client;
