/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  SetMaster5000.js  💣
  *
  *   Contains functions for the following:
  *     💣  converting array to object map
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/

const enableLogs = true;

// Dependencies
import * as _ from 'lodash';

// Helpers
import * as StringMaster5000 from './StringMaster5000';

/**
  *   Given a notification object, return ready-to-render strings
**/
export function arrayToMap(arr) {
  var map = {}, curr;

  for (var i = 0; i < arr.length; i++) {
    curr = arr[i];
    if (!map[curr.sectionTitle]) map[curr.sectionTitle] = [];
    map[curr.sectionTitle].push(curr);
  }

  if (enableLogs) {
    console.log("Converting array:", arr);
    console.log("to map:", map);
  }

  return map;
};


/**
  *   Formats native cell phone contacts and returns them as an array
  *   Contact format: { first_name: "John", last_name: "Doe", phone: 2623508312, pic: "..." }
**/
export function formatNativeContacts(contacts, phoneNumbers) {
  var arr = [],
      nums = [],
      curr;

  for (var contact in contacts) {
    curr = contacts[contact];

    // If this contact doesn't have a phone number, skip over it
    if (!curr.phoneNumbers[0]) continue;

    // Format contact
    var c = {
      first_name: firstName = (curr.givenName) ? curr.givenName : "",
      last_name: lastName = (curr.familyName) ? curr.familyName : "",
      phone: StringMaster5000.formatPhoneNumber(curr.phoneNumbers[0].number),
      stylizedPhone: StringMaster5000.stylizePhoneNumber(curr.phoneNumbers[0].number),
      pic: curr.thumbnailPath,
      type: "phone",
      sectionTitle: "Invite a Contact to Use Payper",
    }

    if (!_.includes(nums, c.phone)) arr.push(c);
    nums.push(c.phone);
  }

  console.log("%cSuccessfully formatted native contacts:", "color:green;font-weight:900;");
  console.log(arr);

  return arr;
};


/**
  *   Converts Firebase contactListen JSON to array of objects
**/
export function contactListToArray(options) {
  var arr = [], curr;

  for (var c in options.contacts) {
    curr = options.contacts[c];
    curr.uid = c;
    curr.sectionTitle = (curr.type == "facebook") ? "Facebook Friends" : "Contacts";
    arr.push(curr);
  }

  return arr;
};


/**
  *   Converts an array of contact objects to an array of just phone numbers
**/
export function contactsArrayToNumbersArray(contacts) {
  var arr = [], curr;

  for (var c in contacts) {
    curr = contacts[c];
    arr.push(curr.phone);
  }

  return arr;
};


/**
  *   Converts Payper user JSON to array
**/
export function globalUserListToArray(options) {
  var arr = [], curr;

  for (var uid in options.users) {
    if (uid != options.uid) {
      curr = options.users[uid];
      curr.uid = uid;
      curr.sectionTitle = "Other Payper Users";
      arr.push(curr);
    }
  }

  return arr;
};


/**
  *   Filters array of contacts lexicographically given a set and a query string
**/
export function filterContacts(contacts, query) {

  // Don't run the set through our regex if there's no query
  if (query === '') return contacts;

  // Delete any trailing or leading whitespace
  query = query.toLowerCase().trim();

  // If user's first or last name contains the regex, add them to the filtered set
  //   - (i flag ignores case)
  const regex = new RegExp(query + '.+$', 'i');
  return contacts.filter(c =>
    c.first_name && c.first_name.search(regex) >= 0
    || c.last_name && c.last_name.search(regex) >= 0
    || (c.first_name + " " + c.last_name) && (c.first_name + " " + c.last_name).search(regex) >= 0
    || c.username && c.username.search(regex) >= 0
    || ((c.first_name) ? c.first_name.toLowerCase() == query : false)
    || ((c.last_name) ? c.last_name.toLowerCase() == query : false)
    || ((c.first_name + " " + c.last_name) ? (c.first_name + " " + c.last_name).toLowerCase() == query : false)
    || ((c.username) ? c.username.toLowerCase() == query : false)
  );
};


/**
  *   Merges two arrays wih
**/
export function mergeArrays(arr1, arr2) {
  // Combine arrays
  var a = arr1.concat(arr2);

  // Remove duplicate elements
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      var bothHaveUIDs = a[i].uid && a[j].uid,
          UIDsMatch = a[i].uid === a[j].uid,
          phoneNumbersMatch = a[i].phone === a[j].phone;
      if (bothHaveUIDs && UIDsMatch) a.splice(j--, 1);
    }
  }

  return a;
};


/**
  *   Given a JSON of payments, convert the JSON to an array
**/
export function JSONToArray(options) {
  if (!options || !options.JSON || options.JSON.length <= 0) return;

  var arr = [],
      curr;

  for (var o in options.JSON) {
    curr = options.JSON[o];
    arr.push(curr);
  }

  return arr;
};


/**
  *   Given an array of payments, return an array of the PID's of all (if any)
  *   payment series that have reached completion.
**/
export function extractCompletedPayments(options) {
  if (!options || !options.payments || options.payments.length <= 0) return [];

  var arr = [],
      curr;

  for (var p in options.payments) {
    curr = options.payments[p];
    if (curr.payments == curr.paymentsMade) arr.push(curr.pid);
  }

  return arr;
};


/**
  *   Given an array of payments and an array of payment ID's, move
  *   the specified payments to the front of the array
**/
export function prioritizePayments(options) {
  // If there are no payments to prioritize, return original payments right away
  if (options.prioritize.length < 1) return options.payments;

  var prioritizedPayments = [],
      curr;

  for (var p in options.payments) {
    if (_.includes(options.prioritize, options.payments[p].pid)) {
      curr = options.payments[p];
      delete options.payments[p];
      prioritizedPayments.push(curr);
    }
  }

  return prioritizedPayments.concat(options.payments);
};

/**
  *   Given an array of payment objects, label the payments with their respective
  *   section headers
**/
export function labelPayments(payments) {
  var numActive = 0, numPendingInvite = 0, numPendingFundingSource = 0, numPendingConfirmation = 0;

  for (var c in payments) {
    const curr = payments[c];
    if (typeof curr.nextPayment == 'number') { curr.stage = "active"; curr.sectionTitle = "Active"; numActive++; }
    else if (!curr.confirmed && !curr.invite) { curr.stage = "pendingConfirmation"; curr.sectionTitle = "Pending - Awaiting Confirmation"; numPendingConfirmation++; }
    else if (curr.invite) { curr.stage = "pendingInvite"; curr.sectionTitle = "Pending - Awaiting Invite Acceptance"; numPendingInvite++; }
    else if (curr.nextPayment == "waiting_on_sender_fs") { curr.stage = "pendingSenderFundingSource"; curr.sectionTitle = "Pending - Awaiting Bank Account"; numPendingFundingSource++; }
    else if (curr.nextPayment == "waiting_on_recip_fs") { curr.stage = "pendingRecipFundingSource"; curr.sectionTitle = "Pending - Awaiting Bank Account"; numPendingFundingSource++; }
    else if (curr.nextPayment == "waiting_on_both_fs") { curr.stage = "pendingBothFundingSources"; curr.sectionTitle = "Pending - Awaiting Bank Account"; numPendingFundingSource++; }
  }

  for (var c in payments) {
    const curr = payments[c];
    if (curr.stage == "active") curr.sectionTitle += " (" + numActive + ")";
    else if (curr.stage == "pendingInvite") curr.sectionTitle += " (" + numPendingInvite + ")";
    else if (curr.stage == "pendingConfirmation") curr.sectionTitle += " (" + numPendingConfirmation + ")";
    else if (curr.stage == "pendingSenderFundingSource") curr.sectionTitle += " (" + numPendingFundingSource + ")";
    else if (curr.stage == "pendingRecipFundingSource") curr.sectionTitle += " (" + numPendingFundingSource + ")";
    else if (curr.stage == "pendingBothFundingSources") curr.sectionTitle += " (" + numPendingFundingSource + ")";
  }

  return payments;
}

/**
  *   (1) Label each payment with its respective sectionTitle
  *   (2) Tack on a "More info" message if necessary
  *   (3) Push the payment to its section's array
  *   (4) Convert the payments arrays to a sectionTitle:paymentArray map
**/
export function filterPayments(payments) {
  // (1)
  payments = labelPayments(payments);

  // (2)
  for (var p in payments) {
    const curr = payments[p];
    if (curr.stage == "pendingConfirmation") {
      if (curr.flow == "incoming") curr.moreInfo = "This payment series will begin when " + curr.sender_name.split(" ")[0] + " confirms your request.";
    } else if (curr.stage == "pendingSenderFundingSource") {
      if (curr.flow == "incoming") curr.moreInfo = curr.sender_name.split(" ")[0] + " hasn't linked a bank account to their Payper account yet. This payment series will begin once they do so.";
      else if (curr.flow == "outgoing") curr.moreInfo = "You haven't linked a bank account to your Payper account yet. This payment series will begin once they do so.";
    } else if (curr.stage == "pendingRecipFundingSource") {
      if (curr.flow == "incoming") curr.moreInfo = "You haven't linked a bank account to your Payper account yet. This payment series will begin once they do so.";
      else if (curr.flow == "outgoing") curr.moreInfo = curr.recip_name.split(" ")[0] + " hasn't linked a bank account to their Payper account yet. This payment series will begin once they do so.";
    } else if (curr.stage == "pendingBothFundingSources") {
      if (curr.flow == "incoming") curr.moreInfo = "Neither you nor " + curr.sender_name.split(" ")[0] + " have linked a bank account to your Payper account. This payment series will begin once you do so.";
      else if (curr.flow == "outgoing") curr.moreInfo = "Neither you nor " + curr.recip_name.split(" ")[0] + " have linked a bank account to your Payper account. This payment series will begin once you do so.";
    }
  }

  // (3)
  var active = [], pendingConfirmation = [], pendingFundingSource = [], pendingInvite = [];
  for (var p in payments) {
    const curr = payments[p];
    curr.pid = p;
    if (curr.stage == "active") active.push(curr);
    else if (curr.stage == "pendingConfirmation") pendingConfirmation.push(curr);
    else if (curr.stage == "pendingSenderFundingSource" || curr.stage == "pendingRecipFundingSource" || curr.stage == "pendingBothFundingSources") pendingFundingSource.push(curr);
    else if (curr.stage == "pendingInvite") pendingInvite.push(curr);
  }

  // (4)
  var paymentMap = {};
  if (active[0]) paymentMap[active[0].sectionTitle] = active;
  if (pendingConfirmation[0]) paymentMap[pendingConfirmation[0].sectionTitle] = pendingConfirmation;
  if (pendingFundingSource[0]) paymentMap[pendingFundingSource[0].sectionTitle] = pendingFundingSource;
  if (pendingInvite[0]) paymentMap[pendingInvite[0].sectionTitle] = pendingInvite;

  console.log("Filtered payment map:", paymentMap);
  return paymentMap;
};
