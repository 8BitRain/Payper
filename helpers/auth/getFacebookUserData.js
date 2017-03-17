import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk'

/**
  *   Given a Facebook accessToken, fetch this user's Facebook user data and
  *   return it to caller
**/
function getFacebookUserData(params) {
  // Format request
  let graphParams = '/me/?fields=email,age_range,first_name,last_name,gender,friends,birthday,picture.type(large)'
  let graphRequest = new GraphRequest(graphParams, null, (err: ?Object, result: ?Object) => {
    if (err) params.onFailure(err)
    else onSuccess(result)
  })

  // Send request
  new GraphRequestManager().addRequest(graphRequest).start()

  // Handle success
  function onSuccess(result) {
    params.onSuccess({
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone: result.phone,
      gender: result.gender,
      friends: result.friends,
      token: result.token,
      facebook_id: result.id,
      profile_pic: (result.picture.data.is_silhouette) ? "" : result.picture.data.url
    })
  }
}

module.exports = getFacebookUserData
