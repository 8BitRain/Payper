import config from '../../config'

function getCustomTokenAndKey(firebaseToken, key, cb) {
  let body = {
    token: firebaseToken,
    env: config.env,
    key: key
  }

  fetch("https://www.getpayper.io/getToken", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  // .then((response) => response.json())
  .then((response) => response.text())
  // .then((responseData) => cb(responseData))
  .then((res) => console.log("--> res", res))
  .catch((err) => { console.log(err); cb(null) })
  .done()
}

module.exports = getCustomTokenAndKey
