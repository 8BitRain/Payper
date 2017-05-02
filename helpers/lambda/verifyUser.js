import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function verifyUser(params, cb) {
  console.log("--> Hitting 'customers/verifyCustomer' with params:", params)
  try {
    fetch(baseURL + "customers/verifyCustomer", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customers/verifyCustomer response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error verifying customer:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = verifyUser
