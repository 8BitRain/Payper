import {Firebase} from '../'
import {callbackForLoop} from '../utils'
import * as _ from 'lodash'

function handleUserSubscribedBroadcasts(casts, cb) {
  if (!casts) {
    cb([])
    return
  }

  let castIDBuffer = Object.keys(casts)
  let broadcasts = {}

  callbackForLoop(0, castIDBuffer.length, {
    onIterate: (loop) => {
      let castID = castIDBuffer[loop.index]
      Firebase.get(`broadcasts/${castID}`, (broadcastData) => {
        if (!broadcastData) {
          loop.continue()
        } else {
          broadcastData.castID = castID

          Firebase.get(`usersPublicInfo/${broadcastData.casterID}`, (casterData) => {
            if (!casterData.firstName) casterData.firstName = "?" // TODO: remove this after Vash adds name to usersPublicInfo tree in FB
            if (!casterData.lastName) casterData.lastName = "?" // TODO: remove this after Vash adds name to usersPublicInfo tree in FB
            casterData.initials = casterData.firstName.charAt(0).concat(casterData.lastName.charAt(0))
            broadcastData.caster = casterData
            broadcasts[castID] = broadcastData
            loop.continue()
          })
        }
      })
    },
    onComplete: () => {
      let arr = _.sortBy(broadcasts, [function(o) { return o.createdAt }]).reverse()
      cb(arr)
    }
  })
}

module.exports = handleUserSubscribedBroadcasts
