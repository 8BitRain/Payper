// Validate.js
exports.validatePhone = require('./Validate').phone
exports.validateEmail = require('./Validate').email
exports.validateName = require('./Validate').name
exports.validatePassword = require('./Validate').password

// Photo.js
exports.uploadProfilePic = require('./Photo').uploadProfilePic

// Miscellaneous
exports.ListOfStates = require('./States').ListOfStates
exports.ListOfStateAbbreviations = require('./States').ListOfStateAbbreviations
exports.device = require('./DeviceType')
