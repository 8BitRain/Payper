import {Alert} from 'react-native'
import {ShareDialog} from 'react-native-fbsdk'

function share() {
  const shareLinkContent = {
    contentType: 'link',
    contentUrl: "https://appsto.re/us/nDcffb.i"
  }

  ShareDialog.canShow(shareLinkContent).then((canShow) => {
    if (canShow) return ShareDialog.show(shareLinkContent)
  })
  .then(
    (res) => {
      // success
      console.log("--> Shared broadcast... res:", res)
    },
    (err) => {
      // failure
      console.log("--> Couldn't share... err:", err)
      Alert.alert("Share Failed", "Something went wrong. Please try again later.")
    }
  )
}

module.exports = share
