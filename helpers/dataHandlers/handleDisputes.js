import {Firebase} from '../'
import {callbackForLoop} from '../utils'

function handleDisputes(data, cb) {
  if (!data) return []

  let keys = Object.keys(data)
  let disputes = []

  callbackForLoop(0, keys.length, {
    onIterate: (loop) => {
      let k = keys[loop.index]
      let curr = data[k]
      curr.castID = k
      Firebase.get(`usersPublicInfo/${curr.casterID}`, (caster) => {
        console.log("--> caster", caster)
        curr.caster = caster
        disputes.push(curr)
        loop.continue()
      })
    },
    onComplete: () => {
      cb({disputeFeed: disputes})
    }
  })
}

module.exports = handleDisputes
