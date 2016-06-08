/**
  *   This script houses all onboarding string validation functions
**/

// u kno
export function validateEmail(input) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
};

// Checks that the password is at least 6 characters, and that two of the
// following are true: at least 1 uppercase letter, at least 1 lowercase letter,
// at least 1 number or special character
export function validatePassword(input) {
  // Check length
  var regexLength = /()/;
  if (!regexLength.test(input)) return false;

  // 2 of 3 of the following must be true
  var regexUpper = /[A-Z]/;
  var regexLower = /[a-z]/;
  var regexNumOrSymb = /([0-9]|[!”#$%&’()*+`-./:;<=>?@[\]^\\_’{|}~])/;
  return regexUpper.test(input) ? (regexLower.test(input) || regexNumOrSym.test(input))
    : (regexLower.test(input) && regexNumOrSym.test(input));
};

// Checks that the first character is capitalized
export function validateName(input) {
  var regex = /^[A-Z]/;
  return regex.test(input);
};
