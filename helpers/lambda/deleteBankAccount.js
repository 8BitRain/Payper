import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function deleteBankAccount(params, cb) {
  console.log("--> Hitting 'customers/getFundingSource' with params:", params)
  try {
    fetch(baseURL + "customers/getFundingSource", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customers/getFundingSource response:", responseData)
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

module.exports = deleteBankAccount
