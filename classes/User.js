import {
  AppState
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
    }, (res) => (res) ? this.update(res) : null)

    this.timer = new Timer()
    this.timer.start()

    AppState.addEventListener('change', this.handleAppStateChange)
  }

  destroy() {

  }

  handleAppStateChange(state) {
    switch (state) {
      case "inactive":
        return
      case "background":
        this.timer.report("sessionDuration", this.uid)
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

  listen(updateViaRedux) {
    this.endpoints = [
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
}
