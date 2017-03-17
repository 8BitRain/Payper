import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function unsubscribeFromCast(params, cb) {
  console.log("--> Hitting 'casts/unsubscribe' with params:", params)
  try {
    fetch(baseURL + "casts/unsubscribe", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/unsubscribe response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error creating user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = unsubscribeFromCast
