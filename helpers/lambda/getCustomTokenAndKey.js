import config from '../../config'

function getCustomTokenAndKey(firebaseToken, key, cb) {
  let body = {
    token: firebaseToken,
    env: config.env,
    key: key
  }

  fetch("http://localhost:8080/getToken", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((responseData) => cb(responseData))
  .catch((err) => { console.log(err); cb(null) })
  .done()
}

module.exports = getCustomTokenAndKey
