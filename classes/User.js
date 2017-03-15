import firebase from 'firebase'
import {
  AppState,
  GeoLocation
} from 'react-native'
import {
  Timer
} from './'
import {
  Firebase
} from '../helpers'
import {
  callbackForLoop
} from '../helpers/utils'
import {
  handleUserData,
  handleUserBroadcasts,
  handleUserSubscribedBroadcasts,
  handleUserFeed
} from '../helpers/dataHandlers'
import {
  getFromAsyncStorage,
  setInAsyncStorage
} from '../helpers/asyncStorage'
import {
  getDecryptedUserData,
  updateGeoLocation
} from '../helpers/lambda'

export default class User {
  constructor() {
    this.broadcastFeed = {}
    this.meFeed = {}
    this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  update(updates) {
    console.log("User updates:", updates)
    for (var k in updates) this[k] = updates[k]
    let shouldCache = updates.uid || updates.appFlags
    if (shouldCache) setInAsyncStorage('user', JSON.stringify(this))
  }

  initialize(userData) {

    // Determine user's initials
    if (userData.firstName && userData.lastName)
      userData.initials = userData.firstName.charAt(0).concat(userData.lastName.charAt(0))

    // Initialize JSON attributes
    this.update(userData)

    // Get decrypted email and phone
    getDecryptedUserData({
      uid: this.uid,
      token: this.token
    }, (res) => {
      if (res) console.log("--> decrypted user data", res)
    })

    // Initalize timer and app state change listener to be used for session
    // duration measurement
    this.timer = new Timer()
    this.timer.start()
    AppState.addEventListener('change', this.handleAppStateChange)

  }

  destroy() {
    setInAsyncStorage('user', '')
    this.stopListeningToFirebase()
    clearInterval(this.tokenRefreshInterval)
    for (var i in this)
      if (typeof this[i] !== 'function')
        this[i] = null
  }

  handleAppStateChange(state) {
    switch (state) {
      case "inactive":
        return
      case "background":
        this.timer.report("sessionDuration", this.uid)
        navigator.geolocation.getCurrentPosition((pos) => {
          updateGeoLocation({
            coords: {lat: pos.coords.latitude, long: pos.coords.longitude},
            state: "WI",
            timestamp: Date.now(),
            token: this.token
          }, (res) => {
            console.log(res)
          })
        })
        break
      case "active":
        this.timer = new Timer()
        this.timer.start()
        if (firebase.auth().currentUser !== null) this.refreshToken()
        break
    }
  }

  refreshToken(updateViaRedux) {
    firebase.auth().currentUser.getToken(true)
    .then((token) => (updateViaRedux) ? updateViaRedux({token}) : this.update({token}))
    .catch((err) => console.log("Error getting new token:", err))
  }

  startListeningToFirebase(updateViaRedux) {
    this.endpoints = [
      {
        endpoint: `users/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => (res) ? updateViaRedux(res) : null
      },
      {
        endpoint: `appFlags/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => {
          if (!res) return
          updateViaRedux({appFlags: res})
        }
      },
      {
        endpoint: `userFeed/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserFeed(res, (broadcastsFeed) => {
          updateViaRedux({broadcastsFeed})
        })
      },
      {
        endpoint: `userBroadcasts/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserBroadcasts(res, (myBroadcasts) => {
          if (!this.meFeed) this.meFeed = {}
          this.meFeed["My Broadcasts"] = myBroadcasts
          updateViaRedux({meFeed: this.meFeed})
        })
      },
      {
        endpoint: `subscribedBroadcasts/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserSubscribedBroadcasts(res, (mySubscriptions) => {
          if (!this.meFeed) this.meFeed = {}
          this.meFeed["My Subscriptions"] = mySubscriptions
          updateViaRedux({meFeed: this.meFeed})
        })
      }
    ]

    for (var i in this.endpoints)
      Firebase.listenTo(this.endpoints[i])
  }

  stopListeningToFirebase() {
    for (var e in this.endpoints)
      Firebase.stopListeningTo(this.endpoints[e])
    this.endpoints = null
  }
}
