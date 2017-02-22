import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function getDecryptedUserData(params, cb) {
  try {
    fetch(baseURL + "users/decrypt", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errorMessage) {
        console.log(`Error from ${users/decrypt} endpoint:`, responseData.errorMessage)
        cb(null)
      } else {
        cb(responseData)
      }
    })
    .catch((err) => {console.log(err); cb(null)})
    .done()
  } catch (err) {console.log(err); cb(null)}
}

module.exports = getDecryptedUserData
