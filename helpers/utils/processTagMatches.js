import {Firebase} from '../'
import {callbackForLoop} from './'

/**
  *   Given tagMatches and services JSONs, manipulate and return services JSON
  *   to include ready-to-render matched user data
**/
function processTagMatches(params, cb) {
  let {tagMatches, services, servicesMap} = params

  let uidBuffer = Object.keys(tagMatches)

  callbackForLoop(0, uidBuffer.length, {
    onIterate: (loop) => {
      let uid = uidBuffer[loop.index]

      // Fetch user data from Firebase
      Firebase.get(`usersPublicInfo/${uid}`, (userData) => {
        if (!userData) {
          loop.continue()
        } else {
          let matchedTags = tagMatches[uid]

          // Traverse services and modify matchedUsers JSON
          for (var tag in matchedTags) {
            let category = servicesMap[tag].category
            for (var i in services[category]) {
              let curr = services[category][i]
              if (curr.tag === tag) {
                if (!curr.matchedUsers) curr.matchedUsers = {}
                curr.matchedUsers[uid] = userData
                curr.matchedUsers[uid].matchType = matchedTags[tag].type
              }
            }
          }

          loop.continue()
        }
      })
    },
    onComplete: () => {
      cb(services)
    }
  })
}

module.exports = processTagMatches
