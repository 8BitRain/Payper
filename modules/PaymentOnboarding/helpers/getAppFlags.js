import firebase from 'firebase'

function getAppFlags(uid, cb) {
  firebase.database().ref(`appFlags/${uid}`).once('value', (snapshot) => {
    let val = snapshot.val()
    cb(val)
  })
}

module.exports = getAppFlags
