import {AsyncStorage} from 'react-native'

function remove(name, cb) {
  if (typeof name !== 'string')
    throw "helpers/asyncStorage/remove expected a string for variable 'name'."

  AsyncStorage.removeItem(`@Store:${name}`)
  .then(() => (typeof cb === 'function') ? cb() : null)
  .done()
}

module.exports = remove
