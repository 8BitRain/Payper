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
  *   Given a ListView.DataSource of payments and a list of payment ID's, move
  *   the specified payments to the front of the DataSource
**/
export function prioritizePayments(options) {
  var curr;

  for (var p in options.payments) {
    if (_.includes(options.prioritize, p)) {
      curr = options.payments[p];
      console.log("Prioritizing", p);
      console.log("Payments before deletion", options.payments);
      delete options.payments[p];
      console.log("Payments after deletion", options.payments);
      // options.payments
    }
  }
};
