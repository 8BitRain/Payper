import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function updateSecret(params, cb) {
  console.log("--> Hitting 'casts/changeSecret' with params:", params)
  try {
    fetch(baseURL + "casts/changeSecret", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/changeSecret response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error updating cast secret:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = updateSecret
