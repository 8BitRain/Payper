import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createOrGetUser(userData, cb) {
  console.log("--> Hitting 'users/create' with userData:", userData)
  try {
    fetch(baseURL + "users/create", {
      method: "POST",
      body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/create response:", responseData)
      cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error creating user:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = createOrGetUser
