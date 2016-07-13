/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Lambda.js  💣
  *
  *   Lambda endpoints:
  *     💣  Base:           'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev'
  *     💣  Create user:    'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create'
  *     💣  Create payment: 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create'
  *     💣  Get user:       'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get'
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


/**
  *   Get user object for specified session token, returning it via callback
  *   function
**/
export function getUserWithToken(sessionToken, callback) {
  var data = {token: sessionToken};

  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        if (typeof callback == 'function') callback(responseData);
        else console.log("callback is not defined as a function");
      } else {
        console.log("Error getting user with token", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
        else console.log("callback is not defined as a function");
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given a user object, store the user in our Lambda-connected database
**/
export function createUser(user, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create", {method: "POST", body: JSON.stringify(user)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Create user Lambda response", responseData);
        if (typeof callback == 'function') callback(responseData.user);
      } else {
        console.log("Error getting user with token", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};
