
var dwolla = require('dwolla-v2');
  //see dwolla.com/applications for your client id and secret
  var client = new dwolla.Client({id: 'kPEAtEMhkbo3a40CtKeK0l8kQo1WZcorA3KKm9fttLKI7WeXTp', secret: 'QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP', environment: 'sandbox',});
  //var client = require('swagger-client');
  //generate a token on dwolla.com/applications
  var accountToken = new client.Token({access_token: "UDSyNb8pbj1vCk7t9CkllWRUEkgP5nlgDU9tsvsmAh2Lt02QpE"});
  console.log(accountToken);
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
DwollaAPI.prototype.log = function () {
  console.log('buz!');
};

DwollaAPI.prototype.run = function(callback){
  runTest(callback);
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
  firstName: 'Bastionzz',
  lastName: 'Transistorz',
  email: 'b@transistorzzz.com',
  type: 'personal',
  address1: '122 N. Forest Hillsz',
  address2: 'Apt 2E',
  city: 'Madison',
  state: 'WI',
  postalCode:'60628',
  dateOfBirth: "1992-03-25",
  ssn: "9993",
  phone: "2123121122"
};



accountToken
  .post('customers', verifiedRequest)
  .then(function(res) {
    res.headers.get('location'); // => 'https://api-uat.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
  });

  accountToken
  .get('customers', { limit: 10 })
  .then(function(res) {
    res.body._embedded.customers[0].firstName; // => 'Jane'
    console.log(res.body._embedded.customers[0].firstName);
    console.log(res.body._embedded.customers[0].lastName);
    console.log(res.body._embedded.customers[0].id);
  });


  /**/
  // Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
  var customerUrl = 'https://api-uat.dwolla.com/customers/7785175e-9e20-40d1-b2ea-48c2ed60d38c';



  accountToken
    .post(`${customerUrl}/funding-sources-token`)
    .then(function(res) {
      res.body.token; // => 'Z9BvpNuSrsI7Ke1mcGmTT0EpwW34GSmDaYP09frCpeWdq46JUg'
      callback(res.body.token);
    });
//return customerUrl;
}

module.exports = new DwollaAPI();
