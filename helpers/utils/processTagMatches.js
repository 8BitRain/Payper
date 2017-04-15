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
          userData.uid = uid

          console.log("--> matchedTags", matchedTags)

          // Traverse services and modify matchedUsers JSON
          for (var k in matchedTags) {
            let category = servicesMap[k].category
            let tag = servicesMap[k].tag

            console.log("--> services[category]", services[category])

            for (var i = 0; i < services[category].length; i++) {
              const INDEX = i
              let service = services[category][INDEX]
              let matchData = matchedTags[tag]

              if (service.tag === tag) {
                if (!service.matchedUsers) service.matchedUsers = {}
                service.matchedUsers[uid] = userData
                service.matchedUsers[uid].matchType = matchedTags[tag].type
                service.matchedUsers[uid].sentRequest = matchData.sentRequest

                console.log("--------------------------------------------------------")
                console.log("--> tag", tag)
                console.log("--> matchData", matchData)
                console.log("--> service", service)
 
              }
            }
          }

          loop.continue()
        }
      })
    },
    onComplete: () => {
      console.log("--> processTagMatches invocation has completed")
      console.log("--> services", services)
      cb(services)
    }
  })
}

module.exports = processTagMatches
