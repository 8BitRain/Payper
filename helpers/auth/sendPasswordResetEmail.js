import firebase from 'firebase'

function sendPasswordResetEmail(email, cb) {
  firebase.auth().sendPasswordResetEmail(email)
  .then(() => cb())
  .catch((err) => cb(err))
}

module.exports = sendPasswordResetEmail
