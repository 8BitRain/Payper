import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function checkIfUserExists(params, cb) {
  try {
    fetch(baseURL + "users/checkFacebook", {method: "POST", body: JSON.stringify(params)})
    .then((response) => response.json())
    .then((responseData) => cb(responseData))
    .catch((err) => console.log(err))
    .done()
  } catch (err) {console.log(err)}
}

module.exports = checkIfUserExists
