import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function checkIfUserExists(params, cb) {
  try {
    fetch(baseURL + "users/checkFacebook", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/checkFacebook response:", responseData)
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

module.exports = checkIfUserExists
