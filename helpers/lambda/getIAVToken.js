import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL

function getIAVToken(params, cb) {
  try {
    fetch(baseURL + "customers/getIAV", {method: "POST", body: JSON.stringify(params)})
    .then((response) => response.json())
    .then((responseData) => {
      console.log("customers/getIAV response:", responseData)
      if (!responseData.errorMessage) {
        if (responseData.token)
          cb({IAVToken: responseData.token})
        else
          console.log("getIAVToken received an undefined token.")
      }
      else
        console.log("Error getting IAV token:", responseData.errorMessage)
    })
    .done()
  } catch (err) {
    console.log("Error getting IAV token:", err)
  }
}

module.exports = getIAVToken
