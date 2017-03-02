import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createOrGetUser(userData, cb) {
  try {
    fetch(baseURL + "users/create", {
      method: "POST",
      body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/create response:", responseData)
      if (responseData.errorMessage || responseData.message) cb(null)
      else cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      cb(null)
    })
    .done()
  } catch (err) {
    console.log(err)
    cb(null)
  }
}

module.exports = createOrGetUser
