import {Firebase} from '../'
import {Actions} from 'react-native-router-flux'

function notify(notif) {
  console.log("--> Got push notif:", notif)
  if (notif.opened_from_tray && callbacks[notif.type])
    callbacks[notif.type](notif)
}

const callbacks = {
  // tested? yes
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
  // tested? yes
  castJoin: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? no
  castLeave: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? no
  tagMatch: () => alert("tagMatch"),
  // tested? no
  removedFromCast: () => alert("removedFromCast"),
  // tested? no
  microdepositsSent: () => alert("microdepositsSent"),
  // tested? no
  customerVerified: () => alert("customerVerified"),
  // tested? no
  paymentFailure: () => alert("paymentFailure"),
  // tested? no
  secretChanged: () => alert("secretChanged"),
  // tested? no
  renewalReminder: () => alert("renewalReminder"),
  // tested? no
  paymentRenewal: () => alert("paymentRenewal")
}

module.exports = notify
