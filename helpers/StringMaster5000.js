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
  *   Formats array of contacts and returns them to be rendered
  *   Rules:
  *     💣  No more than 3 Facebook contacts
  *     💣  No more than 3 Phone contacts
**/
export function formatContacts(contacts) {
  var arr = [],
      numFacebook = 0,
      numPhone = 0,
      curr;

  for (var c in contacts) {
    curr = contacts[c];
    if (curr.type == "facebook") {
      if (numFacebook < 3) arr.push(contacts[c]);
      numFacebook++;
    } else if (curr.type == "phone") {
      if (numFacebook < 3) arr.push(contacts[c]);
      numPhone++;
    } else {
      arr.push(contacts[c]);
    }
  }

  arr.sort((a, b) => {
    if (a.type == "facebook" && b.type == "phone") return -1;
    else return 1;
  });

  return arr;
};


/**
  *   Formats timestamps with Moment.js
**/
export function formatTimestamp(ts) {
  ts = parseInt(ts);
  return moment(ts).calendar();;
};
