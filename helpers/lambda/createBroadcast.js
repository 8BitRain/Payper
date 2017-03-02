import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createBroadcast(broadcastData, cb) {
  try {
    fetch(baseURL + "casts/createBroadcast", {
      method: "POST",
      body: JSON.stringify(broadcastData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("broadcasts/create response:", responseData)
      if (responseData.errorMessage || responseData.message)
        if (typeof cb === 'function') cb(null)
      else
        if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log(err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = createBroadcast
