import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function createOrGetUser(facebookUserData) {
  try {
    fetch(baseURL + "user/create", {method: "POST", body: JSON.stringify(facebookUserData)})
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData)
    })
    .catch((err) => console.log(err))
    .done()
  } catch (err) {console.log(err)}
}

module.exports = createOrGetUser
