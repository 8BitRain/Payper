import db from '../_MOCK_DB'
import {
  firebase,
  callbackForLoop
} from '../helpers'
import {
  handleUserBroadcastFeed
} from '../helpers/dataHandlers'

export default class User {
  constructor() {
    this.uid = "uid1"
    this.broadcastFeed = {}
    this.initialize()
  }

  update(updates) {
    console.log("User updates:", updates)
    for (var k in updates) this[k] = updates[k]
  }

  initialize() {
    let userData = db.user[this.uid]
    this.update(userData)
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
      firebase.listenTo(this.endpoints[i])
  }
}
