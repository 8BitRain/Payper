import {Firebase} from '../'
import {callbackForLoop} from '../utils'
import * as _ from 'lodash'

function handleUserFeed(casts, cb) {
  if (!casts) {
    cb([])
    return
  }

  let castIDBuffer = Object.keys(casts)
  let broadcasts = {
    "Global": {},
    "Local": {},
    "Friends of Friends": {},
    "Friends": {}
  }

  callbackForLoop(0, castIDBuffer.length, {
    onIterate: (loop) => {
      let castID = castIDBuffer[loop.index]
      Firebase.get(`broadcasts/${castID}`, (broadcastData) => {
        if (!broadcastData) {
          loop.continue()
        } else {
          broadcastData.castID = castID

          Firebase.get(`users/${broadcastData.casterID}`, (casterData) => {
            broadcastData.caster = casterData

            if (broadcastData.type === "global")
              broadcasts["Global"][castID] = broadcastData
            if (broadcastData.type === "local")
              broadcasts["Local"][castID] = broadcastData
            if (broadcastData.type === "friendNetwork")
              broadcasts["Friends of Friends"][castID] = broadcastData
            if (broadcastData.type === "friends")
              broadcasts["Friends"][castID] = broadcastData

            loop.continue()
          })
        }
      })
    },
    onComplete: () => {
      let broadcastFeed = {
        "Global": _.sortBy(broadcasts["Global"], [function(o) { return o.createdAt }]).reverse(),
        "Local": _.sortBy(broadcasts["Local"], [function(o) { return o.createdAt }]).reverse(),
        "Friends of Friends": _.sortBy(broadcasts["Friends of Friends"], [function(o) { return o.createdAt }]).reverse(),
        "Friends": _.sortBy(broadcasts["Friends"], [function(o) { return o.createdAt }]).reverse()
      }

      cb(broadcastFeed)
    }
  })
}

module.exports = handleUserFeed
