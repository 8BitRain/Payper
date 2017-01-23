export function email(input) {
  if (typeof input === 'undefined' || !input) return false;

  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
};

export function name(input) {
  if (typeof input === 'undefined' || !input) return false;

  var isCapitalized = /^[A-Z]/;
  var containsInvalidCharacter = /[\^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,]/;
  return isCapitalized.test(input) && !containsInvalidCharacter.test(input);
};

export function phone(input) {
  if (typeof input === 'undefined' || !input) return { isValid: false };

  var isCorrectLength = input.length === 10;

  return {
    isCorrectLength: isCorrectLength,
    isValid: isCorrectLength
  };
};


export function password(input) {
  if (typeof input === 'undefined' || !input) return {
    isLongEnough: false,
    hasUppercase: false,
    // hasLowercase: false,
    hasSymbol: false,
    hasNumber: false,
    isValid: false
  }

  var isLongEnough = /^.{8,}$/.test(input);
  var hasUppercase = /[A-Z]/.test(input);
  // var hasLowercase = /[a-z]/.test(input);
  var hasSymbol = /[!”#$%&’()*+`\-./:;<=>?@\]\[\\^_’{|}~]/.test(input);
  var hasNumber = /[0-9]/.test(input);

  return {
    isLongEnough: isLongEnough,
    hasUppercase: hasUppercase,
    // hasLowercase: hasLowercase,
    hasSymbol: hasSymbol,
    hasNumber: hasNumber,
    isValid: isLongEnough && hasUppercase && hasSymbol && hasNumber
    // isValid: isLongEnough && hasUppercase && hasLowercase && hasSymbol && hasNumber
  };
};
