import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createOrGetUser(facebookUserData, cb) {
  try {
    fetch(baseURL + "users/create", {
      method: "POST",
      body: JSON.stringify(facebookUserData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errorMessage) {
        console.log(`Error from ${users/create} endpoint:`, responseData.errorMessage)
        cb(null)
      } else {
        cb(responseData)
      }
    })
    .catch((err) => console.log(err))
    .done()
  } catch (err) {console.log(err)}
}

module.exports = createOrGetUser
