import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function verifyMicrodeposits(params, cb) {
  console.log("--> Hitting 'customers/verifyMicroDeposits' with params:", params)
  try {
    fetch(baseURL + "customers/verifyMicroDeposits", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customers/verifyMicroDeposits response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error verifying microdeposits:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = verifyMicrodeposits
