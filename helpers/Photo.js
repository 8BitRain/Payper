import * as Lambda from '../services/Lambda'
import {RNS3} from 'react-native-aws3'

exports.uploadProfilePic = function(uri, email, token, cb) {
  let env = require('../config').details.env
  let reformattedEmail = email.replace('.', '>')

  let photo = {
    uri: uri, // local path or external uri will both work
    name: reformattedEmail.concat('.png'),
    type: 'image/png'
  }

  let config = {
    bucket: "payper-profilepics-" + env,
    region: "us-east-1",
    accessKey: "AKIAJAPGM72WRCJVO33A",
    secretKey: "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",
    successActionStatus: 201
  }

  RNS3.put(photo, config)
  .then((res) => {
    if (res.status == 201) {
      let url = res.headers.Location
      Lambda.updateProfilePic({url, token})
      if (typeof cb === 'function') cb(true)
    } else {
      console.log("--> Failed to upload photo to S3")
      console.log("--> res", res)
      if (typeof cb === 'function') cb(false)
    }
  })
  .progress((e) => {
    console.log("-->", (e.loaded / e.total))
  })
  .catch((err) => {
    console.log("--> Failed to upload photo to S3")
    console.log("--> err", err)
    if (typeof cb === 'function') cb(false)
  })
}
