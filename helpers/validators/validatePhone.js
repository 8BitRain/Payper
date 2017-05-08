function validatePhone(input) {
  if (typeof input === 'undefined' || !input) return false
  return input.length === 10
}

module.exports = validatePhone
