export function email(input) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
};

export function password(input) {
  return typeof input != 'undefined' && input.length > 0;
};

export function name(input) {
  var isCapitalized = /^[A-Z]/;
  var containsInvalidCharacter = /[\^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,]/;
  return isCapitalized.test(input) && !containsInvalidCharacter.test(input);
};
