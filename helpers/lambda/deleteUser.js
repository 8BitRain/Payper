import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function deleteUser(params, cb) {
  console.log("--> Hitting 'users/delete' with params:", params)
  try {
    fetch(baseURL + "users/delete", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/delete response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error deleting user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = deleteUser
