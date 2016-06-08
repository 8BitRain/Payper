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
  var regexLength = /^.{6,}$/.test(input);

  // 3 of 4 of the following must be true
  var regexUpper = /[A-Z]/.test(input);
  var regexLower = /[a-z]/.test(input);
  var regexSym = /[!”#$%&’()*+`\-./:;<=>?@\]\[\\^_’{|}~]/.test(input);
  var regexNum = /[0-9]/.test(input);

  return {
    length: regexLength,
    upper: regexUpper,
    lower: regexLower,
    num: regexNum,
    sym: regexSym
  };
};

// Individual password validations for real time feedback on validity of
// password
export function validateUpperCase(input) { return /[A-Z]/.test(input) };
export function validateLowerCase(input) { return /[a-z]/.test(input) };
export function validateNumber(input) { return /[0-9]/.test(input) };
export function validateSymbol(input) { return /[!”#$%&’()*+`\-./:;<=>?@\]\[\\^_’{|}~]/.test(input) };

// Checks that the first character is capitalized
export function validateName(input) {
  var regex = /^[A-Z]/;
  return regex.test(input);
};
