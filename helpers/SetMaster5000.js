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

const enableLogs = false;

// Dependencies
import * as _ from 'lodash';

// Helpers
import * as StringMaster5000 from './StringMaster5000';

/**
  *   Given an array of objects with 'sectionTitle' properties, create a map
  *   based on those section titles
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
      selected: false,
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

  console.log("contactListToArray was invoked with options", options)

  for (var c in options.contacts) {
    curr = options.contacts[c];
    curr.uid = c;
    curr.sectionTitle = (curr.type == "facebook") ? "Facebook Friends" : "Contacts";
    curr.selected = false;
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
      curr.sectionTitle = options.sectionTitle;
      curr.selected = false;
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
  try {
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
      || c.phone && c.phone.search(regex) >= 0
      || c.phone && c.phone == query
      || c.stylizedPhone && c.stylizedPhone.search(regex) >= 0
      || c.stylizedPhone && c.stylizedPhone == query
    );
  } catch(err) {
    console.log("Error filtering contacts:", err);
    return contacts;
  }
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
  *   Given an array of payments, return an array of the PID's of all (if any)
  *   pending series.
**/
export function extractPendingPayments(payments) {
  let arr = [], curr

  for (var p in payments) {
    curr = payments[p]
    if (curr.status.indexOf("pending") >= 0)
      arr.push(curr.pid)
  }

  return arr
}


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
  *   Given an array of phone numbers and an array of contacts, remove
  *   all instances of the phone numbers from the contacts array
**/
export function parseNativeContactList(options) {
  if (!options.phoneNumbers || !options.contacts || options.phoneNumbers.length == 0 || options.contacts.length == 0) return;

  for (var c in options.contacts)
    if (_.includes(options.phoneNumbers, options.contacts[c].phone))
      options.contacts.splice(c, 1);

  return options.contacts;
}


/**
  *   Given a JSON of key value pairs, tack on the key as a property of the value
**/
export function tackOnKeys(j, label) {
  for (var k in j)
    j[k][label] = k;

  return j
}


/**
  *   Given a payment JSON...
  *     1. tack on any necessary attributes
  *     2. convert to array
  *     3. push pending payments to front
  *     4. return ordered payments to caller
**/
export function processPayments(payments) {
  if (!payments) return []

  // 1. tack on any necessary attributes
  for (var k in payments) {
    let curr = payments[k]
    curr.pid = k
    curr.incoming = curr.flow === "in"
  }

  // 2. convert to array
  let paymentArray = JSONToArray({ JSON: payments })

  // 3. push pending payments to front
  let paymentsToPrioritize = extractPendingPayments(paymentArray)

  let orderedPayments = (paymentsToPrioritize.length === 0)
    ? paymentArray
    : prioritizePayments({ payments: paymentArray, prioritize: paymentsToPrioritize })

  // 4. return ordered payments to caller
  return orderedPayments;
}













//
