      runTest();

      function runTest() {
      var dwolla = require("dwolla-v2");
      //see dwolla.com/applications for your client id and secret
      var client = new dwolla.Client({id: 'a250b344-844d-41e1-80c0-211f196e50a7', secret: 'QgUYW8EYBwDWioWBOdGUi1kQvWh41PJd2yYCAyfkrWUvim5fqP', environment: 'sandbox',});

      //generate a token on dwolla.com/applications
      var accountToken = new client.Token({access_token: "boyUEt648u76lIsXqws17kMVBSp9k1UTnwY675mglaF8hcxQ5Q"});

      //alert("FISH");
      var unverifiedRequest = {
        firstName: 'Jane3',
        lastName: 'Merchant',
        email: 'jmerchant3@nomail.net',
        ipAddress: '92.99.99.99'
      };

      var verifiedRequest = {
        firstName: 'Bastion',
        lastName: 'Transistorz',
        email: 'b@transistorz.com',
        type: 'personal',
        address1: '122 N. Forest Hills',
        address2: 'Apt 2E',
        city: 'Madison',
        state: 'WI',
        postalCode:'60620',
        dateOfBirth: "1992-03-25",
        ssn: "9998",
        phone: "3123123122"
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
          });

      console.log("dwollaTest is working");
    }
