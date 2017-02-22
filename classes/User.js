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
  handleUserBroadcastFeed
} from '../helpers/dataHandlers'
import {
  getFromAsyncStorage,
  setInAsyncStorage
} from '../helpers/asyncStorage'
import {
  getDecryptedUserData
} from '../helpers/lambda'

export default class User {
  constructor() {
    this.broadcastFeed = {}
    this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }

  update(updates) {
    console.log("User updates:", updates)
    for (var k in updates) this[k] = updates[k]
    setInAsyncStorage('user', JSON.stringify(this))
  }

  initialize(userData) {
    this.update(userData)
  }

  initialize(userData) {
    this.update(userData)

    getDecryptedUserData({
      uid: this.uid,
      token: this.token
    }, (res) => {
      if (res) console.log("--> decrypted user data", res)
    })

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
        navigator.geolocation.getCurrentPosition((res) => {
          res.token = this.token
          res.state = "WI"
          updateGeoLocation(pos)
        })
        console.log("--> Would update current location.")
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
        endpoint: `testTree/userBroadcastFeed/${this.uid}`,
        eventType: 'value',
        listener: null,
        callback: (res) => handleUserBroadcastFeed(res, (broadcastFeed) => {
          updateViaRedux({broadcastFeed})
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
