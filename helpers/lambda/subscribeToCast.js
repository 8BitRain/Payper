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
      if (responseData.decryptedSecret) cb({decryptedSecret: responseData.decryptedSecret})
      else cb({errorMessage: true})
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb({errorMessage: true})
    })
    .done()
  } catch (err) {
    console.log("Error subscribing to cast:", err)
    if (typeof cb === 'function') cb({errorMessage: "Couldn't hit backend."})
  }
}

module.exports = subscribeToCast
