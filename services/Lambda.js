/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Lambda.js  💣
  *
  *   Lambda endpoints:
  *     💣  Base:               'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev'
  *     💣  Create user:        'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/create'
  *     💣  Create payment:     'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create'
  *     💣  Get user:           'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/auth/get'
  *     💣  Accept payment:     'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/accept'
  *     💣  Read notification:  'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/accept'
  *     💣  Direct invite:      'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/direct'
  *     💣  Payment invite:     'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/payment'
  *     💣  GET Funding source: 'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/getFundingSource'
  *     💣  Delete user:        'https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/delete'
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/

/**
  *   Curls
**/
// Direct invite
// curl -X POST -d @vash_hitta.txt https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/viaPayment --header "Content-Type:application/json"
// Payment creation
// curl -X POST -d @vash_hitta.txt https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create --header "Content-Type:application/json"

//
// curl -X POST -d @vash_hitta.txt https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/viaPayment --header "Content-Type:application/json"

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
      } else {
        console.log("%cError getting user with token: " + responseData.errorMessage, "color:red;font-weight:900;");
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
        if (typeof callback == 'function') callback(true);
      } else {
        console.log("Error creating payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
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

/*Grab IAV token for specic customer*/
 //Ping the server with firebase token
   //Server will respond with iav_token
 //Inject token into webview
 //Process
 //On Callback handle what occurs in webview

export function getIavToken(data, callback){
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/utils/getIAV", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("IAV TOKEN" + JSON.stringify(responseData));
        callback(true, responseData);
      } else {
        console.log(JSON.stringify(responseData));
        callback(false, "");
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};

/**
  *   Given payment_id and token, cancel a payment
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
  *   Create a DwollaCustomer
**/
export function createCustomer(data, callback){
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/create", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("CreateCustomerResponse:", responseData);
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


/**
  *   Given session_token and phone number, invite a user to join the app
  *   Alert caller of success
**/
export function inviteDirect(options) {
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
export function inviteViaPayment(payment, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/invites/viaPayment", {method: "POST", body: JSON.stringify(payment)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Invite via payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(true);
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


/**
  *   Given session_token, get user's funding source
**/
export function getFundingSource(options, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/getFundingSource", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Get funding source Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error getting funding source:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given session_token and uid, delete the specified user
**/
export function deleteUser(options, callback) {
  try {
    fetch("https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/user/delete", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Delete user Lambda response:", responseData);
        if (typeof callback == 'function') callback(true);
      } else {
        console.log("Error deleting user:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};
