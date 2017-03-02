import {Firebase} from '../'
import {callbackForLoop} from '../utils'

function handleUserBroadcastFeed(userBroadcastFeed, cb) {
  if (!userBroadcastFeed) {
    cb({})
    return
  }

  let castIDBuffer = Object.keys(userBroadcastFeed)
  let broadcasts = {}

  callbackForLoop(0, castIDBuffer.length, {
    onIterate: (loop) => {
      let buffer = castIDBuffer[loop.index].split(":")
      let section = buffer[0]
      let castID = buffer[1]

      Firebase.get(`broadcasts/${castID}`, (broadcastData) => {
        if (!broadcastData) {
          loop.continue()
        } else {
          Firebase.get(`users/${broadcastData.casterID}`, (casterData) => {
            broadcastData.caster = casterData
            if (!broadcasts[section]) broadcasts[section] = {}
            broadcasts[section][castID] = broadcastData
            loop.continue()
          })
        }
      })
    },
    onComplete: () => {
      cb(broadcasts)
    }
  })
}

module.exports = handleUserBroadcastFeed
