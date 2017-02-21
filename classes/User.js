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

export default class User {
  constructor() {
    this.broadcastFeed = {}
    this.initialize()
  }

  update(updates) {
    console.log("User updates:", updates)
    for (var k in updates) this[k] = updates[k]
    setInAsyncStorage('user', JSON.stringify(this))
  }

  initialize() {
    // TODO: errythang
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
