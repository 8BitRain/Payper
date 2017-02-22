function handleUserData(userData, cb) {
  if (!userData) return {}

  console.log("handleUserData was invoked. User data:", userData)

  return userData
}

module.exports = handleUserData
