/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Lambda.js  💣
  *
  *   Lambda endpoints:
  *     💣  Base:                  'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev'
  *     💣  Get user:              'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/auth/get'
  *     💣  Get decrypted user:    'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/getPersonal'
  *     💣  Get funding source:    'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/getFundingSource'
  *     💣  Create user:           'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/create'
  *     💣  Create payment:        'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/create'
  *     💣  Accept payment:        'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/accept'
  *     💣  Reject payment:        'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/reject'
  *     💣  Read notification:     'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/notifications/markSeen'
  *     💣  Direct invite:         'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/invites/direct'
  *     💣  Payment invite:        'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/invites/payment'
  *     💣  Delete user:           'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/delete'
  *     💣  Delete funding source: 'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/removeFundingSource'
  *     💣  Block user:            'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/block'
  *     💣  Update phone contacts: 'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/updatePhoneContacts'
  *     💣  Update user info:      'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/update'
  *     💣  Archive payment:       'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/archive'
  *     💣  Check beta invites:    'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/beta/inviteMatch'
  *     💣  Check beta signups:    'https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/beta/betaListMatch'
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/auth/get", {method: "POST", body: JSON.stringify(data)})
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
      fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/create", {method: "POST", body: JSON.stringify(user)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/facebookCreate", {method: "POST", body: JSON.stringify(user)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        //console.log("Create user Lambda response", responseData);
        console.log("LAMBDA => USER ACCOUNT STATUS: " +  responseData.account_status);
        console.log("LAMBDA => LAMBDA RESPONSE DATA: " + JSON.stringify(responseData));
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/create", {method: "POST", body: JSON.stringify(data)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/accept", {method: "POST", body: JSON.stringify(options)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/reject", {method: "POST", body: JSON.stringify(options)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/utils/getIAV", {method: "POST", body: JSON.stringify(data)})
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
export function cancelPayment(params) {
  console.log("params", params);
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/cancel", {method: "POST", body: JSON.stringify(params)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) console.log("Cancel payment Lambda response:", responseData);
      else console.log("Error cancelling payment:", responseData.errorMessage);
    })
    .done();
  } catch (err) {
    console.log("Error cancelling payment:", err);
  }
};

/**
  *   Create a DwollaCustomer
**/
export function createCustomer(data, callback){
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/create", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      //console.log("CreateCustomerResponse:" +  JSON.stringify(responseData));
      if (!responseData.errorMessage) {
        console.log("CreateCustomerResponse:" +  JSON.stringify(responseData));
        //if (typeof callback == 'function') callback(true);
        callback(true);
      } else {
        //var responsePrint = responseData[0];
        //responsePrint = responseData.JSON.stringify(errorMessage);
        //console.log("Error: " + responsePrint );
        console.log("Error: " + JSON.stringify(responseData.errorMessage));
        alert(JSON.stringify(JSON.parse(responseData.errorMessage)));
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};

/**
  *   sendMicrodeposits
**/
export function sendMicrodeposits(data, callback){
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/verifyMicroDeposits", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("verifyMicroDeposits:" +  JSON.stringify(responseData));
        //if (typeof callback == 'function') callback(true);
        callback(true);
      } else {
        //var responsePrint = responseData[0];
        //responsePrint = responseData.JSON.stringify(errorMessage);
        //console.log("Error: " + responsePrint );
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/updatePhoneNumber", {method: "POST", body: JSON.stringify(data)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Update Phone response:", responseData);
        if (typeof callback == 'function') callback(true);
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
export function seeNotifications(options) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/notifications/markSeen", {method: "POST", body: JSON.stringify(options)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/invites/direct", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Invite direct Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error inviting directly:", responseData.errorMessage);
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/invites/viaPayment", {method: "POST", body: JSON.stringify(payment)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/getFundingSource", {method: "POST", body: JSON.stringify(options)})
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
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/delete", {method: "POST", body: JSON.stringify(options)})
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


/**
  *   Given session_token and uid, get decrypted phone and email number for
  *   the specified user
**/
export function getDecryptedUser(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/getPersonal", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Get decrypted user Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error getting decrypted user:", responseData.errorMessage);
        if (typeof callback == 'function') callback(responseData);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given list of phone numbers (phoneNumbers) and session token (token),
  *   update a user's phone contacts
**/
export function updateContacts(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/triggerContactScan", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Update phone contacts Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error updating phone contacts:", responseData.errorMessage);
        if (typeof callback == 'function') callback(responseData);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given a user object (user) and session token (token),
  *   update a user's information
**/
export function updateUser(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/update", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Update user Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error updating user:", responseData.errorMessage);
        if (typeof callback == 'function') callback(responseData);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given a payment id (payment_id) and session token (token),
  *   archive the specified payment
**/
export function archivePayment(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/payments/archive", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Archive payment Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error archiving payment:", responseData.errorMessage);
        if (typeof callback == 'function') callback(responseData);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given session token (token), remove this user's funding source
**/
export function removeFundingSource(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/customer/removeFundingSource", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Remove funding source Lambda response:", responseData);
        if (typeof callback == 'function') callback(true);
      } else {
        console.log("Error removing funding source:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given phone number (phoneNumber), check if this phone number was invited
  *   to beta
**/
export function checkBetaInvites(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/beta/inviteMatch", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Check beta invites Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error checking beta invites:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given email address (email), check if this email was used to sign up for
  *   beta.
**/
export function checkBetaSignups(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/beta/betaListMatch", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Check beta signups Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error checking beta signups:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
};


/**
  *   Given session token (token) and the uid of the user to block (blocked_id),
  *   block the specified user from interacting with this user
**/
export function blockUser(options, callback) {
  try {
    fetch("https://mey71fma7i.execute-api.us-east-1.amazonaws.com/dev/user/block", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Block user Lambda response:", responseData);
        if (typeof callback == 'function') callback(responseData);
      } else {
        console.log("Error blocking user:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
}
