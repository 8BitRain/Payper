import {firebase, callbackForLoop} from '../helpers'
import db from '../_MOCK_DB'

export default class User {
  constructor() {
    this.uid = "uid1"
    this.broadcastFeed = {
      "Friends": {},
      "Local": {},
      "Global": {}
    }
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
        callback: (res) => {
          if (!res) return

          let bidBuffer = res.split(",")
          let broadcasts = {}

          callbackForLoop(0, bidBuffer.length, {
            onIterate: (loop) => {
              let buffer = bidBuffer[loop.index].split(":")
              let section = buffer[0]
              let bid = buffer[1]

              firebase.get(`testTree/broadcasts/${bid}`, (res) => {
                if (res) {
                  if (!broadcasts[section]) broadcasts[section] = {}
                  broadcasts[section][bid] = res
                }
                loop.continue()
              })
            },
            onComplete: () => {
              updateViaRedux({broadcastFeed: broadcasts})
            }
          })
        }
      }
    ]

    for (var i in this.endpoints)
      firebase.listenTo(this.endpoints[i])
  }
}
