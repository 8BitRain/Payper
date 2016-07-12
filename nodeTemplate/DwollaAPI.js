//NOTE if the server is running into issues you might need to refresh your sandbox tokens at uat-dwolla.com
var dwolla = require('dwolla-v2');
  //see dwolla.com/applications for your client id and secret
  var client = new dwolla.Client({id: "kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp", secret: "QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP", environment: 'sandbox',});
  //var client = require('swagger-client');
  //generate a token on dwolla.com/applications
  var accountToken = new client.Token({access_token: "9scZQk4eAj2UmikysNYKm5zBJ7Qj5JidPnYlsO84gijNoOHh3F"});
  //console.log(accountToken);
  //https://uat.dwolla.com/error/servererror?aspxerrorpath=/oauth/v2/{localhost:3000/dwollaView}
  //https://uat.dwolla.com/oauth/v2/authenticate?client_id={kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp}&response_type=code&redirect_uri={localhost:3000/dwollaView}&scope={Funding}


  /*var dwolla = new client({
      url: 'https://api-uat.dwolla.com/swagger.json',
      authorizations: {
          dwollaHeaderAuth: new client.ApiKeyAuthorization('Authorization', 'IIoz5DW50QO4JBJ2BG700gzow8VTeRhMrOagfibVQgf8CL3T10', 'header')
      },
      usePromise: true
  });*/

var DwollaAPI = function () {};
DwollaAPI.prototype.account = accountToken;
DwollaAPI.prototype.log = function () {
  console.log('buz!');
};

DwollaAPI.prototype.swapAccounts = function(options){
  //console.log("Account ID From Dwolla: " + options.account_id);
  accountToken = new client.Token({access_token: options.access_token, refresh_token: options.refresh_token, expires_in: options.expires_in, scope: options.scope, account_id: options.account_id});
  console.log("Account Token after swap: " +  JSON.stringify(accountToken));

}
DwollaAPI.prototype.run = function(callback){
  runTest(callback);
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
      //console.log(res);
      callback(res.body.token);
    }).catch(err => console.log('ERROR', JSON.stringify(err)));


    /* Enable this code to grab funding sources from a Traditional Dwolla Account
    var accountUrl = 'https://api-uat.dwolla.com/accounts/' + accountToken.account_id;
    console.log("accountUrl" + accountUrl);

    accountToken
      .get(`${accountUrl}/funding-sources`)
      .then(function(res) {
        res.body._embedded['funding-sources'][0].name;
        console.log(res.body._embedded['funding-sources'][0].name);
        console.log("Full Finding Source info: " + res.body_embedded['funding-sources'][0]);
         // => 'US Bank Checking'
      }).catch(err => console.error('We got it!', err));*/

/*accountToken
  .get(customerUrl)
  .then(function(res) {
    res.body.firstName; // => 'Jane'
  }) .catch(err => console.error('We got it!', err));*/

}


function runTest(callback) {
//alert("FISH");
var unverifiedRequest = {
  firstName: 'Jane3',
  lastName: 'Merchant',
  email: 'jmerchant3@nomail.net',
  ipAddress: '92.99.99.99'
};

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

console.log("Running DWOLLA API");

/*accountToken
  .post('on-demand-authorizations')
  .then(function(res) {
    res.body.buttonText; // => "Agree & Continue"
    callback(res.body.buttonText);
  });*/

  var requestBody = {
   'routingNumber': '222222226',
   'accountNumber': '123456789',
   'type': 'checking',
   'name': 'Vera Brittain’s Checking'
 };

var customerUrl = 'https://api-uat.dwolla.com/customers/6dbcad5e-c1f8-4667-aa55-6f3ad3148b3f';
 accountToken
   .post(`${customerUrl}/funding-sources`, requestBody)
   .then(function(res) {
     res.headers.get('location'); // => 'https://api-uat.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31'
     callback(res.headers.get('location'));
   });

/*accountToken
  .post('customers', verifiedRequest)
  .then(function(res) {
    console.log("reached x 2");
    res.headers.get('location'); // => 'https://api-uat.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
    callback(res.headers.get('location'));
  });*/

  /*accountToken
  .get('customers', { limit: 10 })
  .then(function(res) {
    res.body._embedded.customers[0].firstName; // => 'Jane'
    console.log(res.body._embedded.customers[0].firstName);
    console.log(res.body._embedded.customers[0].lastName);
    console.log(res.body._embedded.customers[0].id);
    callback(res.body.token);
  });*/




  /**/
  // Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
  var customerUrl = 'https://api-uat.dwolla.com/customers/7785175e-9e20-40d1-b2ea-48c2ed60d38c';


  /*accountToken
    .post(`${customerUrl}/funding-sources-token`)
    .then(function(res) {
      res.body.token; // => 'Z9BvpNuSrsI7Ke1mcGmTT0EpwW34GSmDaYP09frCpeWdq46JUg'
      callback(res.body.token);
    });*/
//return customerUrl;
}

module.exports = new DwollaAPI();
module.exports.accountToken = accountToken;
module.exports.client = client;
