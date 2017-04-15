import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function requestCast(params, cb) {
  console.log("--> Hitting 'casts/request' with params:", params)
  try {
    fetch(baseURL + "casts/request", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/request response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error requesting cast:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = requestCast
