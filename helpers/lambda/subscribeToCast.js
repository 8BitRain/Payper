import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function subscribeToCast(params, cb) {
  console.log("--> Hitting 'casts/subscribe' with params:", params)
  try {
    fetch(baseURL + "casts/subscribe", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/subscribe response:", responseData)
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

module.exports = subscribeToCast
