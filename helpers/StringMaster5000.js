/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  StringMaster5000.js  💣
  *
  *   Contains stringification functions for the following:
  *     💣  timestamps
  *     💣  purposes
  *     💣  notifications
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


// Dependencies
import moment from 'moment';
import * as Timestamp from './Timestamp';
import colors from '../styles/colors';

/**
  *   Given a notification object, return ready-to-render strings
**/
export function formatNotification(n) {
  var notification = {
    pic: n.notifier_pic,
    name: n.notifier,
    ts: formatTimestamp(n.ts),
  };

  var firstName = n.notifier.split(" ")[0];

  switch (n.type) {
    case "PAYMENT":
      notification.info = firstName + " started paying you " + formatPurpose(n.purpose) + ".";;
      notification.icon = "credit";
      notification.iconColor = colors.alertGreen;
      break;
    case "PAYMENT_DELETED":
      notification.info = firstName + " stopped paying you " + formatPurpose(n.purpose) + ".\n" + n.paymentsMade + " of " + n.payments + " payments were made.";
      notification.icon = "cross";
      notification.iconColor = colors.alertRed;
      break;
    case "REQUEST":
      notification.info = firstName + " requested $" + n.amount + " per month " + formatPurpose(n.purpose) + ".";
      notification.icon = "hand";
      notification.iconColor = colors.alertYellow;
      break;
    case "PAYMENT_ACCEPT":
      notification.info = firstName + " accepted your payment request " + formatPurpose(n.purpose) + ".";
      notification.icon = "credit";
      notification.iconColor = colors.alertGreen;
      break;
    case "PAYMENT_REJECT":
      notification.info = firstName + " rejected your payment request " + formatPurpose(n.purpose) + ".";
      notification.icon = "cross";
      notification.iconColor = colors.alertRed;
      break;
    default:
      notification.info = "Notification couldn't be loaded.";
      notification.icon = "cross";
      notification.iconColor = colors.alertRed;
  }

  return notification;
};


/**
  *   Formats memo strings to be consistent throughout the app.
  *   Example: "FOR Netflix" => "for Netflix"
  *            "rent" => "for rent"
  *            "for world domination" => "for world domination"
**/
export function formatPurpose(purpose) {
  var arr = purpose.split(" ");
  arr[0] = arr[0].toLowerCase();
  if (arr[0] != "for") arr.unshift("for");
  return arr.join(" ");
};


/**
  *   Formats array of native cell phone contacts and returns them to be rendered
  *   Format:
  *     {
  *       first_name: "John",
  *       last_name: "Doe",
  *       phone: 2623508312,
  *       pic: "...",
  *     }
**/
export function formatNativeContacts(contacts) {
  var arr = [],
      curr;

  for (var contact in contacts) {
    curr = contacts[contact];
    if (!curr.phoneNumbers[0]) continue;

    var c = {
      first_name: (curr.givenName) ? curr.givenName : "",
      last_name: (curr.familyName) ? curr.familyName : "",
      phone: formatPhoneNumber(curr.phoneNumbers[0].number),
      stylizedPhone: stylizePhoneNumber(curr.phoneNumbers[0].number),
      pic: curr.thumbnailPath,
      type: 'phone',
    }

    arr.push(c);
  }

  console.log("%cSuccessfully formatted native contacts:", "color:green;font-weight:900;");
  console.log(arr);

  return arr;
};

/**
  *   Orders array of contacts with Payper contacts having higher priority than
  *   native phone contacts
**/
export function orderContacts(contacts) {
  var arr = [],
      numFacebook = 0,
      numPhone = 0,
      curr;

  for (var c in contacts) {
    curr = contacts[c];
    curr.uid = c;

    // Limted number of contacts
    // if (curr.type == "facebook") {
    //   if (numFacebook < 3) arr.push(contacts[c]);
    //   numFacebook++;
    // } else if (curr.type == "phone") {
    //   if (numPhone < 3) arr.push(contacts[c]);
    //   numPhone++;
    // } else {
    //   arr.push(contacts[c]);
    // }

    // Unlimited number of contacts
    arr.push(contacts[c]);

  }

  arr.sort((a, b) => {
    if (a.type == "facebook" && b.type == "phone") return -1;
    else return 1;
  });

  return arr;
};


/**
  *   Filters array of contacts lexicographically given a set and a query string
**/
export function filterContacts(contacts, query) {
  // Don't run the set through our regex if there's no query
  if (query === '') return contacts;

  // If user's first or last name contains the regex, add them to the filtered set
  const regex = new RegExp(query + '.+$', 'i');
  return contacts.filter(c => c.first_name && c.first_name.search(regex) >= 0 || c.last_name && c.last_name.search(regex) >= 0);
};


/**
  *   Formats timestamps with Moment.js
**/
export function formatTimestamp(ts) {
  ts = parseInt(ts);
  return moment(ts).calendar();;
};


/**
  *   Format phone number
**/
export function formatPhoneNumber(num) {
  return num.replace(/\D/g,'');
};


/**
  *   Stylize phone numbers like this: +(262)-305-8038
**/
export function stylizePhoneNumber(num) {
  num = formatPhoneNumber(num);
  if (num.length < 10 || num.length > 11) return num;
  if (num.length == 10) {
    var areaCode = num.substring(0, 3),
        firstThree = num.substring(3, 6),
        lastFour = num.substring(6, 10);
    return "+" + "(" + areaCode + ")-" + firstThree + "-" + lastFour;
  } else if (num.length == 11) {
    var areaCode = num.substring(1, 4),
        firstThree = num.substring(4, 7),
        lastFour = num.substring(7, 11);
    return "+" + "(" + areaCode + ")-" + firstThree + "-" + lastFour;
  }
}

/**
  *   String checker:
  *     Empty:
  *     💣 string is not null
  *     💣 string is not ""
  *     💣 string is not full of white space
**/
export function checkIf(query) {
  return {
    isEmpty: query != null && query != "" && query.replace(/\s/g, '').length > 0,
  };
}


/**
  *   Capitalize the first letter in a string
**/
export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
