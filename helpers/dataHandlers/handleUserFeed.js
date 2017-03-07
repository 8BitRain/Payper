import {Firebase} from '../'
import {callbackForLoop} from '../utils'
import * as _ from 'lodash'

function handleUserFeed(casts, cb) {
  if (!casts) {
    cb([])
    return
  }

  console.log("--> handleUserFeed was invoked...")
  console.log("--> casts", casts)

  // let castIDBuffer = Object.keys(casts)
  // let broadcasts = {}
  //
  // callbackForLoop(0, castIDBuffer.length, {
  //   onIterate: (loop) => {
  //     let castID = castIDBuffer[loop.index]
  //     Firebase.get(`broadcasts/${castID}`, (broadcastData) => {
  //       if (!broadcastData) {
  //         loop.continue()
  //       } else {
  //         broadcastData.castID = castID
  //         Firebase.get(`users/${broadcastData.casterID}`, (casterData) => {
  //           broadcastData.caster = casterData
  //           broadcasts[castID] = broadcastData
  //           loop.continue()
  //         })
  //       }
  //     })
  //   },
  //   onComplete: () => {
  //     let arr = _.sortBy(broadcasts, [function(o) { return o.createdAt }]).reverse()
  //     cb(arr)
  //   }
  // })
}

module.exports = handleUserFeed