import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function getDecryptedUserData(params, cb) {
  console.log("--> Hitting 'users/decrypt' with params:", params)
  try {
    fetch(baseURL + "users/decrypt", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/decrypt response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error decrypting user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = getDecryptedUserData
