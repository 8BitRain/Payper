import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function resumeRenewal(params, cb) {
  console.log("--> Hitting 'casts/resumeRenewal' with params:", params)
  try {
    fetch(baseURL + "casts/resumeRenewal", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/resumeRenewal response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error resuming renewal:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = resumeRenewal
