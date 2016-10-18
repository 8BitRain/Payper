import config from '../config';
let baseURL = config.dev.lambdaBaseURL;

/**
  *   Given session_token and payment info, initialize a payment
**/
export function createPayment(data, callback) {
  try {
    fetch(baseURL + "payments/create", {method: "POST", body: JSON.stringify(data)})
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
    fetch(baseURL + "payments/accept", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "payments/reject", {method: "POST", body: JSON.stringify(options)})
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
  *   Given payment_id and token, cancel a payment
**/
export function cancelPayment(params) {
  console.log("params", params);
  try {
    fetch(baseURL + "payments/cancel", {method: "POST", body: JSON.stringify(params)})
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
  *   Given timestamp, and session_token, mark a notification as read
**/
export function seeNotifications(options) {
  try {
    fetch(baseURL + "notifications/markSeen", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "invites/direct", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "invites/viaPayment", {method: "POST", body: JSON.stringify(payment)})
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
  *   Given list of phone numbers (phoneNumbers) and session token (token),
  *   update a user's phone contacts
**/
export function updateContacts(options, callback) {
  try {
    fetch(baseURL + "user/triggerContactScan", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "user/update", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "payments/archive", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "customer/removeFundingSource", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "beta/inviteMatch", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "beta/betaListMatch", {method: "POST", body: JSON.stringify(options)})
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
    fetch(baseURL + "user/block", {method: "POST", body: JSON.stringify(options)})
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
