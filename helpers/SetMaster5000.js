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
  var map = {};

  arr.forEach(function(element) {
    if (!map[element.sectionTitle]) map[element.sectionTitle] = [];
    map[element.sectionTitle].push(element);
  });

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
      sectionTitle: "Phone Contacts",
    }

    //
    if (!_.includes(nums, c.phone)) arr.push(c);
    nums.push(c.phone);
  }

  console.log("%cSuccessfully formatted native contacts:", "color:green;font-weight:900;");
  console.log(arr);

  return arr;
};


/**
  *   Converts Payper contact JSON to array
**/
export function contactsToArray(contacts) {
  var arr = [], curr;

  for (var c in contacts) {
    curr = contacts[c];
    curr.uid = c;
    curr.sectionTitle = "Facebook Friends";
    arr.push(curr);
  }

  return arr;
};


/**
  *   Converts Payper user JSON to array
**/
export function globalUserListToArray(options) {
  var arr = [], curr;

  console.log("ALL CONTACTS:", options.allContacts);

  for (var u in options.users) {
    curr = options.users[u];
    curr.uid = u;
    curr.sectionTitle = "Other Payper Users";
    arr.push(curr);
  }

  return arr;
};


/**
  *   Filters array of contacts lexicographically given a set and a query string
**/
export function filterContacts(contacts, query) {

  console.log("Filter contacts:\nContacts: " + contacts + "\nQuery: " + query);

  // Don't run the set through our regex if there's no query
  if (query === '') return contacts;

  query = query.toLowerCase().trim();

  // If user's first or last name contains the regex, add them to the filtered set
  // (i flag ignores case)
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
