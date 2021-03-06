import {Firebase} from '../'
import {callbackForLoop} from '../utils'
import * as _ from 'lodash'

function handleUserFeed(casts, cb) {
  if (!casts) {
    cb({})
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

          Firebase.get(`usersPublicInfo/${broadcastData.casterID}`, (casterData) => {
            casterData.initials = casterData.firstName.charAt(0).concat(casterData.lastName.charAt(0))
            casterData.uid = broadcastData.casterID
            broadcastData.caster = casterData
            broadcastData.type = broadcastData.type.toLowerCase()

            if (broadcastData.type === "world")
              broadcasts["Global"][castID] = broadcastData
            else if (broadcastData.type === "local")
              broadcasts["Local"][castID] = broadcastData
            else if (broadcastData.type === "friendnetwork")
              broadcasts["Friends of Friends"][castID] = broadcastData
            else if (broadcastData.type === "friends")
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
