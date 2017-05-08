import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createDispute(params, cb) {
  console.log("--> Hitting 'disputes/create' with params:", params)
  try {
    fetch(baseURL + "disputes/create", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("disputes/create response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error creating dispute:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = createDispute
