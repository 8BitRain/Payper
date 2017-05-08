import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function updateUserTags(params, cb) {
  console.log("--> Hitting 'users/updateUserTags' with params:", params)
  try {
    fetch(baseURL + "users/updateUserTags", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("users/updateUserTags response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error updating user tags:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = updateUserTags
