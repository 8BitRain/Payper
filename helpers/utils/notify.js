import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'
import {Actions} from 'react-native-router-flux'

function notify(notif) {
  console.log("--> Got push notif:", notif)
  if (notif.opened_from_tray && callbacks[notif.type])
    callbacks[notif.type]()
}

const callbacks = {
  castLeave: () => alert("castLeave"),
  castJoin: () => alert("castJoin"),
  tagMatch: () => alert("tagMatch"),
  removedFromCast: () => alert("removedFromCast"),
  microdepositsSent: () => alert("microdepositsSent"),
  customerVerified: () => alert("customerVerified"),
  paymentFailure: () => alert("paymentFailure"),
  secretChanged: () => alert("secretChanged"),
  castCreated: () => alert("castCreated"),
  renewalReminder: () => alert("renewalReminder"),
  paymentRenewal: () => alert("paymentRenewal")
}

module.exports = notify
