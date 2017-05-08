import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function rateUser(params, cb) {
  console.log("--> Hitting 'users/rate' with params:", params)
  try {
    fetch(baseURL + "users/rate", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/rate response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error rating user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = rateUser
