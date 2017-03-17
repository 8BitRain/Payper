import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function updateGeoLocation(params, cb) {
  try {
    fetch(baseURL + "users/updateLocation", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.errorMessage) {
        console.log(`Error from ${users/updateLocation} endpoint:`, responseData.errorMessage)
        if (typeof cb === 'function') cb(null)
      } else {
        if (typeof cb === 'function') cb(responseData)
      }
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

module.exports = updateGeoLocation
