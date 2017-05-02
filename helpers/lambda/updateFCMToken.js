import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function updateFCMToken(params, cb) {
  console.log("--> Hitting 'users/storeFCMToken' with params:", params)
  try {
    fetch(baseURL + "users/storeFCMToken", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/storeFCMToken response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error storing FCMToken:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = updateFCMToken
