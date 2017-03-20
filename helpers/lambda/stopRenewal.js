import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function stopRenewal(params, cb) {
  console.log("--> Hitting 'casts/stopRenewal' with params:", params)
  try {
    fetch(baseURL + "casts/stopRenewal", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/stopRenewal response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error stopping renewal:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = stopRenewal
