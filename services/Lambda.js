/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Lambda.js  💣
  *
  *   Lambda endpoints:
  *     💣  Base:              'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev'
  *     💣  Create user:       'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create'
  *     💣  Create payment:    'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create'
  *     💣  Get user:          'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get'
  *     💣  Accept payment:    'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/accept'
  *     💣  Read notification: 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/accept'
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
      console.log("RESPONSE:", responseData);
      if (!responseData.errorMessage) {
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error getting user with token:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
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
        //Note responseData can come with additional fields so has a +1 level of encapsulation

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

/**
  *   Given a FB user object, store the FB user in our Lambda-connected database
**/
export function createFBUser(user, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/facebookCreate", {method: "POST", body: JSON.stringify(user)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Create user Lambda response", responseData);
        console.log("USER ACCOUNT STATUS: " +  responseData.account_status);
        if (typeof callback == 'function') callback(responseData.user, responseData.account_status);
      } else {
        console.log("Error getting FBuser with token", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given session_token and payment info, initialize a payment
**/
export function createPayment(data, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Create payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error creating payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback("error");
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
}


/**
  *   Given session_token and payment_id, confirm a payment request
**/
export function confirmPayment(options) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/accept", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Accept payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error confirming payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given session_token and payment_id, confirm a payment request
**/
export function rejectPayment(options) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/reject", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Reject payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error rejecting payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given pay_id and session_token, cancel a payment
**/
export function cancelPayment(options) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/cancel", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Cancel payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error cancelling payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};

/**
  *   Update Phone Number
**/
export function updatePhone(data, callback){
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/updatePhoneNumber", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Update Phone response:", responseData);
        //if (typeof callback == 'function') callback(true);
        callback(true);
      } else {
        console.log("Error:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given timestamp, and session_token, mark a notification as read
**/
export function seeNotification(options) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/notifications/markSeen", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("See notification Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error seeing notification:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};
