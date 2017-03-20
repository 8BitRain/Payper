import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function getBankAccount(params, cb) {
  console.log("--> Hitting 'customer/getFundingSource' with params:", params)
  try {
    fetch(baseURL + "customer/getFundingSource", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customer/getFundingSource response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error getting bank account:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = getBankAccount
