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
  *     💣  Direct invite:     'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/direct'
  *     💣  Payment invite:    'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/payment'
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
        //Note responseData can come with additional fields so has a +1 level of encapsulation
        /* responseData.account_status can either be created or exists*/
        console.log("User Creation Stats: " + responseData.account_status);
        if(responseData.account_status == "exists"){
          //Set a flag in Firebase to assist with actions that require an account to already
          //be in the exist state.
        }
        if(responseData.account_status == "created"){
          //Set a flag
          //Set Phone Numbers
          //Set a flag in Firebase to assist with actions that require an account to already
          //be in the created state.
        }
        if (typeof callback == 'function') callback(responseData.user);
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


/**
  *   Given session_token and phone number, invite a user to join the app
  *   Alert caller of success
**/
export function inviteDirect(options) {

  // Testing
  console.log("Session token:", options.token);
  console.log("Phone number:", options.phoneNumber);

  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/direct", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Invite direct Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error inviting direcly:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given payment info, session_token, and phone number, create payment and
  *   invite other party to join the app.
**/
export function inviteViaPyment(options) {

  // Testing
  console.log("Payment info:", JSON.stringify(options.payment));
  console.log("Session token:", options.token);
  console.log("Phone number:", options.phoneNumber);

  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/payment", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Invite via payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error inviting via payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};
