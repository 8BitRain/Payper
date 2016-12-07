import * as firebase from 'firebase'

class TrackOnce {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i]
  }

  report(label, uid, props) {
    let key = Date.now()
    let path = "userMetrics/" + label + "/" + uid
    let data = {}
    if (props) Object.assign(data, props)
    firebase.database().ref(path).child(key).set(data)
  }
}

module.exports = TrackOnce
