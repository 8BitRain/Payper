import {AsyncStorage} from 'react-native'

function get(name, cb) {
  if (typeof name !== 'string')
    throw "helpers/asyncStorage/get expected a string for variable 'name'."

  AsyncStorage.getItem(`@Store:${name}`)
  .then((val) => cb(val))
  .done()
}

module.exports = get
