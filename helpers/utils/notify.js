import {Firebase} from '../'
import {Actions} from 'react-native-router-flux'

function notify(notif) {
  console.log("--> Got push notif:", notif)
  if (notif.opened_from_tray && callbacks[notif.type])
    callbacks[notif.type](notif)
}

const callbacks = {
  castCreated: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Firebase.get(`usersPublicInfo/${broadcastData.casterID}`, (casterData) => {
        casterData.initials = casterData.firstName.charAt(0).concat(casterData.lastName.charAt(0))
        casterData.uid = broadcastData.casterID
        broadcast.caster = casterData
        Actions.UnjoinedBroadcast({broadcast, canViewCasterProfile: true})
      })
    })
  },
  castJoin: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  castLeave: () => alert("castLeave"),
  tagMatch: () => alert("tagMatch"),
  removedFromCast: () => alert("removedFromCast"),
  microdepositsSent: () => alert("microdepositsSent"),
  customerVerified: () => alert("customerVerified"),
  paymentFailure: () => alert("paymentFailure"),
  secretChanged: () => alert("secretChanged"),
  renewalReminder: () => alert("renewalReminder"),
  paymentRenewal: () => alert("paymentRenewal")
}

module.exports = notify
