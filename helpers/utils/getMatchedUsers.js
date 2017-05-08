import {Firebase} from '../'
import {callbackForLoop} from './'

function getMatchedUsers(params, cb) {
  let {matchedUsers, tagMatches} = params
  let tagBuffer = Object.keys(tagMatches)
  let uidBuffer = []

  for (var i = 0; i < tagBuffer.length; i++) {
    let tag = tagBuffer[i]
    let matches = tagMatches[tag]
    let uids = Object.keys(matches)
    for (var j = 0; j < uids.length; j++) {
      let uid = uids[j]
      if (!uidBuffer.includes(uid)) uidBuffer.push(uid)
    }
  }

  callbackForLoop(0, uidBuffer.length, {
    onIterate: (loop) => {
      let uid = uidBuffer[loop.index]

      if (matchedUsers[uid]) {
        loop.continue()
        return
      }

      Firebase.get(`usersPublicInfo/${uid}`, (userData) => {
        if (!userData) {
          loop.continue()
          return
        }
        
        userData.uid = uid
        matchedUsers[uid] = userData
        loop.continue()
      })
    },
    onComplete: () => {
      cb(matchedUsers)
    }
  })
}

module.exports = getMatchedUsers
