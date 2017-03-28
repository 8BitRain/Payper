import config from '../../config'
const baseURL = config[config.env].lambdaBaseURL
function verifyCustomer(options, callback) {
  try {
    fetch(baseURL + "customers/verifyCustomer", {method: "POST", body: JSON.stringify(options)})
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.errorMessage) {
        console.log("Verify microdeposits Lambda response:", responseData);
        if (typeof callback == 'function') callback(true);
      } else {
        console.log("resdata", responseData);
        console.log("Error verifying microdeposits:", responseData.errorMessage);
        if (typeof callback == 'function') callback(false);
      }
    })
    .done();
  } catch (err) {
    console.log(err);
  }
}

module.exports = verifyCustomer
