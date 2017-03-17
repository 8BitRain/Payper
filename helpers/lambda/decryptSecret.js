import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function decryptSecret(params, cb) {
  console.log("--> Hitting 'casts/decryptSecret' with params:", params)
  try {
    fetch(baseURL + "casts/decryptSecret", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/decryptSecret response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error decrypting secret:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = decryptSecret
