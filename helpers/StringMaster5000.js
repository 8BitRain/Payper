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
import * as _ from 'lodash';

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
  if (purpose) {
    var arr = purpose.split(" ");
    arr[0] = arr[0].toLowerCase();
    if (arr[0] != "for") arr.unshift("for");
    return arr.join(" ");
  }

  return purpose;
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
  if (!num) return "";

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
    isEmpty: query == null || query.replace(/\s/g, '').length === 0,
  };
}


/**
  *   Capitalize the first letter in a string
**/
export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
