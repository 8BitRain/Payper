import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function deleteCast(params, cb) {
  console.log("--> Hitting 'casts/deleteBroadcast' with params:", params)
  try {
    fetch(baseURL + "casts/deleteBroadcast", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/deleteBroadcast response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error deleting cast:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = deleteCast
