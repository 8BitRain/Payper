import {firebase, callbackForLoop} from '../'

function handleUserBroadcastFeed(userBroadcastFeed, cb) {
  if (!userBroadcastFeed) return {}
  
  let bidBuffer = userBroadcastFeed.split(",")
  let broadcasts = {}

  callbackForLoop(0, bidBuffer.length, {
    onIterate: (loop) => {
      let buffer = bidBuffer[loop.index].split(":")
      let section = buffer[0]
      let bid = buffer[1]

      firebase.get(`testTree/broadcasts/${bid}`, (broadcastData) => {
        if (!broadcastData) {
          loop.continue()
        } else {
          firebase.get(`testTree/user/${broadcastData.casterID}`, (casterData) => {
            broadcastData.caster = casterData
            if (!broadcasts[section]) broadcasts[section] = {}
            broadcasts[section][bid] = broadcastData
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
