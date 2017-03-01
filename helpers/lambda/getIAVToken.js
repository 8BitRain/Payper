function getIAVToken(params, cb) {
  try {
    fetch(baseURL + "utils/getIAV", {method: "POST", body: JSON.stringify(params)})
    .then((response) => response.json())
    .then((responseData) => {
      console.log("User.getIAVToken responseData is", responseData)
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
    console.log("Error getting IAV token:", responseData.errorMessage)
  }
}

module.exports = getIAVToken
