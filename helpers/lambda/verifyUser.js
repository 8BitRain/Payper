import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function verifyUser(params, cb) {
  console.log("--> Hitting 'users/verify' with params:", params)
  try {
    fetch(baseURL + "users/verify", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/verify response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error verifying user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = verifyUser
