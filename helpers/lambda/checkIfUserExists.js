import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function checkIfUserExists(facebookID, cb) {
  try {
    fetch(baseURL + "user/checkFacebook", {method: "POST", body: JSON.stringify({facebook_id: facebookID})})
    .then((response) => response.json())
    .then((responseData) => cb(responseData))
    .catch((err) => console.log(err))
    .done()
  } catch (err) {console.log(err)}
}

module.exports = checkIfUserExists
