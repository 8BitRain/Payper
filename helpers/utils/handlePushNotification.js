import FCM from 'react-native-fcm'
import {AppState, PushNotificationIOS} from 'react-native'
import {Firebase} from '../'
import {Actions} from 'react-native-router-flux'

function handlePushNotification(notif) {
  console.log("--> Got push notif:", notif)

  if ("active" === AppState.currentState) {
    // TODO: Present local notification if app is in foreground
    // NOTE: There seems to be a compatibility issue with react-native and
    //       react-native-fcm versions.
    // FCM.presentLocalNotification({
    //   body: "New message, check it out!",
    //   priority: "high",
    //   title: "Chat",
    //   sound: "default",
    //   show_in_foreground: true,
    //   tag: "CHAT"
    // })
  } else if (notif.opened_from_tray && callbacks[notif.type]) {
    callbacks[notif.type](notif)
  }
}

const callbacks = {
  // tested? yes
  castCreated: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Firebase.get(`usersPublicInfo/${broadcast.casterID}`, (casterData) => {
        casterData.initials = casterData.firstName.charAt(0).concat(casterData.lastName.charAt(0))
        casterData.uid = broadcast.casterID
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
  // tested? yes, broken, waiting for vash to add 'identifer' attr
  castLeave: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? yes
  tagMatch: () => {
    Actions.refresh({newTab: "Explore"})
  },
  // tested? no
  removedFromCast: () => (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? no
  microdepositsSent: () => alert("microdepositsSent"),
  // tested? no
  customerVerified: () => alert("customerVerified"),
  // tested? no
  paymentFailure: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? yes, broken, waiting for vash to add 'identifer' attr
  secretChanged: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? no
  renewalReminder: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  },
  // tested? no
  paymentRenewal: (notif) => {
    Firebase.get(`broadcasts/${notif.identifier}`, (broadcast) => {
      broadcast.castID = notif.identifier
      Actions.AdminBroadcast({broadcast, canViewCasterProfile: true})
    })
  }
}

module.exports = handlePushNotification
