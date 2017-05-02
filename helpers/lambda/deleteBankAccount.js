import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function deleteBankAccount(params, cb) {
  console.log("--> Hitting 'customers/removeFundingSource' with params:", params)
  try {
    fetch(baseURL + "customers/removeFundingSource", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customers/removeFundingSource response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error removing funding source:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = deleteBankAccount
