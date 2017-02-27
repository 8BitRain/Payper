import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function updateFCMToken(userData, cb) {
  try {
    fetch(baseURL + "users/storeFCMToken", {
      method: "POST",
      body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errorMessage) {
        console.log(`Error from ${users/storeFCMToken} endpoint:`, responseData.errorMessage)
        cb(null)
      } else {
        cb(responseData)
      }
    })
    .catch((err) => console.log(err))
    .done()
  } catch (err) {console.log(err)}
}

module.exports = updateFCMToken
