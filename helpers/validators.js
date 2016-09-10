/**
  *   This script houses all onboarding string validation functions
**/

// u kno
export function validateEmail(input) {
  var regexFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
  var validations = {
    // TODO Check for dupes in database
    unique: true,
    format: regexFormat,
    valid: false
  };
  validations.valid = getValidated(validations);

  return validations;
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

  var validations = {
    length: regexLength,
    upper: regexUpper,
    lower: regexLower,
    num: regexNum,
    sym: regexSym,
    valid: false
  };
  validations.valid = getValidated(validations);

  return validations;
};

// Individual password validations for real time feedback on validity of
// password
export function validateUpperCase(input) { return /[A-Z]/.test(input) };
export function validateLowerCase(input) { return /[a-z]/.test(input) };
export function validateNumber(input) { return /[0-9]/.test(input) };
export function validateSymbol(input) { return /[!”#$%&’()*+`\-./:;<=>?@\]\[\\^_’{|}~]/.test(input) };

export function validateBasicInfo(firstName, lastName, email, phone){
    console.log("validating basic info: " + '\n' +  JSON.stringify(firstName)
    + '\n' + JSON.stringify(lastName) +
    '\n' + JSON.stringify(email) + '\n'
     + JSON.stringify(phone));
    var validations = {
      firstName: firstName.valid,
      lastName: lastName.valid,
      email: email.valid,
      phone: phone.valid,
      valid: false
    }

    validations.valid = getValidated(validations);
    return validations;
};

export function validatePhone(input){
  //Enforces digit and length
  var regexLength = /^\d{10}$/.test(input);

  var validations = {
    length: regexLength,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};

/*Validate Postal Code*/
export function validatePostalCode(input){
  //Enforces digit and length
  var regexLength = /^\d{5}$/.test(input);

  var validations = {
    length: regexLength,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};

/*Validate SSN */
export function validateSSN(input){
  //Enforces digit and length
  var regexLength = /^\d{5}$/.test(input);

  var validations = {
    length: regexLength,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};

/*Validate DOB (may be unnesesary)*/

export function validateDOB(input){
  //Enforces digit and length
  var regexDate = /[0-9]{4}[/.-](?:1[0-2]|0?[1-9])[/.-](?:3[01]|[12][0-9]|0?[1-9])/.test(input);

  var validations = {
    date: regexDate,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};



// Checks that the first character is capitalized
export function validateName(input) {
  var regexCapitalized = /^[A-Z]/.test(input);
  var regexFormat = !/[\^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,]/.test(input);

  var validations =  {
    capitalized: regexCapitalized,
    format: regexFormat,
    valid: false
  };
  validations.valid = getValidated(validations);

  return validations;
};

//Validations for address*/
export function validateAddress(input){

  //Temporary validation for non empty
  var non_empty = false;
  if(input != 0){
    var non_empty = true;
  }

  var validations = {
    non_empty: non_empty,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};

/*Validations for City*/
export function validateCity(input){

  //Temporary validation for non empty
  var non_empty = false;
  if(input.length != 0){
    var non_empty = true;
  }

  var validations = {
    non_empty: non_empty,
    valid: false
  };

  validations.valid = getValidated(validations);
  return validations;
};



// Checks that input is a valid decimal or non-decimal number
//    ex. 1.0, 0.1, .1, 1, 1.
export function validateDecimal(input) {
  var regexNumeric = /^((\d+(\.\d*)?)|(\.\d+))$/;
  return regexNumeric.test(input);
};

// Checks if any of the values in the provided hash are false
export function getValidated(input) {
  for (var index in input) {
    if (index == "valid") continue;
    if (!input[index]) return false;
  }

  return true;
};
