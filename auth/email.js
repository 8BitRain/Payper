import firebase from 'firebase'

/**
  *   Given an email address for a Payper user, send them a password reset link
**/
exports.sendPasswordResetEmail = function(email, cb) {
  console.log("sendPasswordResetEmail was invoked...")
  console.log("email", email)

  firebase.auth().sendPasswordResetEmail(email)
  .then(() => onSuccess())
  .catch((err) => onFailure(err))

  // Handle success
  function onSuccess() {
    cb()
  }

  // Handle failure
  function onFailure(err) {
    cb(err)
  }
}
