import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function withdrawFunds(params, cb) {
  console.log("--> Hitting 'users/withdrawFunds' with params:", params)
  try {
    fetch(baseURL + "users/withdrawFunds", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/withdrawFunds response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error withdrawing funds:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = withdrawFunds
