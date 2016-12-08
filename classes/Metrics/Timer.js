import * as firebase from 'firebase'
import { report } from './index'

class Timer {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i]
    this.startTime = null
    this.stopTime = null
    this.duration = null
  }

  start() {
    this.startTime = Date.now()
  }

  stop() {
    this.stopTime = Date.now()
    this.duration = this.stopTime - this.startTime
  }

  report(label, uid, props) {
    this.stop()

    let key = Date.now()
    let path = "userMetrics/timing/" + label + "/" + uid
    let data = {
      startTime: this.startTime,
      stopTime: this.stopTime,
      duration: this.duration,
      uid: uid
    }

    if (props) Object.assign(data, props)

    firebase.database().ref(path).child(key).set(data)
  }
}

module.exports = Timer

/**
  Firebase Structure
  ---------------------------------------------------------------------------
  root
    - userMetrics
      - anonymous
        - cancelledUserCreations
        - failedUserCreations
          - name, email, pass, etc...
      - uid
        - timing
        - buttonPresses
        - flows
        - invalidInputs
  ---------------------------------------------------------------------------
**/
