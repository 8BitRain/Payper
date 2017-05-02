import {RNS3} from 'react-native-aws3'
import {replaceAt} from './'

function uploadKYCDocument(params, cb) {
  let {uri, email, token} = params
  let env = require('../../config').env
  let indexOfDot = email.lastIndexOf('.')
  let reformattedEmail = replaceAt(email, indexOfDot, '>')

  let photo = {
    uri: uri, // local path or external uri will both work
    name: reformattedEmail.concat('.png'),
    type: 'image/png'
  }

  let config = {
    bucket: `payper-verifydocs-${env}`,
    region: "us-east-1",
    accessKey: "AKIAJAPGM72WRCJVO33A",
    secretKey: "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",
    successActionStatus: 201
  }

  RNS3.put(photo, config)
  .then((res) => (res.status === 201) ? cb(res.headers.location) : cb(null, res))
  .progress((e) => null)
  .catch((err) => cb(null, err))
}

module.exports = uploadKYCDocument
