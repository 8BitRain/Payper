import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function kickFromCast(params, cb) {
  console.log("--> Hitting 'casts/kick' with params:", params)
  try {
    fetch(baseURL + "casts/kick", {
      method: "POST",
      body: JSON.stringify(params)
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("casts/kick response:", responseData)
      if (typeof cb === 'function') cb(responseData)
    })
    .catch((err) => {
      console.log(err)
      if (typeof cb === 'function') cb(null)
    })
    .done()
  } catch (err) {
    console.log("Error kicking from cast:", err)
    if (typeof cb === 'function') cb(null)
  }
}

module.exports = kickFromCast
