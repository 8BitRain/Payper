import {AsyncStorage} from 'react-native'

function set(name, data, cb) {
  if (typeof name !== 'string')
    throw "helpers/asyncStorage/set expected a string for variable 'name'."
  if (typeof data !== 'string')
    throw "helpers/asyncStorage/set expected a string for variable 'data'."

  AsyncStorage.setItem(`@Store:${name}`, data)
  .then(() => cb())
  .done()
}

module.exports = set
