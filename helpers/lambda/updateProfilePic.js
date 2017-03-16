function updateProfilePic(options) {
  try {
    fetch(baseURL + "user/updateProfilePic", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Update profile pic Lambda response:", responseData)
        if (typeof callback == 'function') callback(responseData)
      } else {
        console.log("Error updating profile pic:", responseData.errorMessage,  "\nFullResponseMessage:", responseData)
        if (typeof callback == 'function') callback(false)
      }
    })
    .done()
  } catch (err) {
    console.log(err)
  }
}

module.exports = updateProfilePic
