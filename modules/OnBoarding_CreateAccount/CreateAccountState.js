import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize currentUser vars
var currentUser = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  },
  passwordValidations = {
    length: false,
    upper: false,
    lower: false,
    num: false,
    sym: false,
    valid: false
  },
  emailValidations = {
    unique: true,
    format: false,
    valid: false
  },
  firstNameValidations = {
    capitalized: false,
    format: false,
    valid: false
  },
  lastNameValidations = {
    capitalized: false,
    format: false,
    valid: false
  },
  phoneNumberValidations = {
    length: false,
    valid: false
  };

// Initialize state
const initialState = Map({
  currentUser,
  currentPage: 0,
  passwordToggle: false,
  passwordValidations,
  emailValidations,
  firstNameValidations,
  lastNameValidations,
  phoneNumberValidations
});

// Action types
const SET_PAGE = 'SET_PAGE',
      SET_EMAIL_VALIDATIONS = 'SET_EMAIL_VALIDATIONS',
      SET_PASSWORD_VALIDATIONS = 'SET_PASSWORD_VALIDATIONS',
      SET_FIRST_NAME_VALIDATIONS = 'SET_FIRST_NAME_VALIDATIONS',
      SET_LAST_NAME_VALIDATIONS = 'SET_LAST_NAME_VALIDATIONS',
      SET_PHONE_NUMBER_VALIDATIONS = 'SET_PHONE_NUMBER_VALIDATIONS',
      SET_EMAIL = 'SET_EMAIL',
      SET_PASSWORD = 'SET_PASSWORD',
      SET_FIRST_NAME = 'SET_FIRST_NAME',
      SET_LAST_NAME = 'SET_LAST_NAME',
      SET_PHONE_NUMBER = 'SET_PHONE_NUMBER',
      PASSWORD_TOGGLE = 'PASSWORD_TOGGLE';

// Action creators
export function setPage(index) {
  return { type: SET_PAGE, index: index };
};

export function setEmailValidations(input) {
  return { type: SET_EMAIL_VALIDATIONS, input: input };
};

export function setPasswordValidations(input) {
  return { type: SET_PASSWORD_VALIDATIONS, input: input };
};

export function setFirstNameValidations(input) {
  return { type: SET_FIRST_NAME_VALIDATIONS, input: input };
};

export function setLastNameValidations(input) {
  return { type: SET_LAST_NAME_VALIDATIONS, input: input };
};

export function setPhoneNumberValidations(input) {
  return { type: SET_PHONE_NUMBER_VALIDATIONS, input: input };
};

export function setEmail(input) {
  return { type: SET_EMAIL, input: input };
};

export function setPassword(input) {
  return { type: SET_PASSWORD, input: input };
};

export function setFirstName(input) {
  return { type: SET_FIRST_NAME, input: input };
};

export function setLastName(input) {
  return { type: SET_LAST_NAME, input: input };
};

export function setPhoneNumber(input) {
  return { type: SET_PHONE_NUMBER, input: input };
};

export function setPasswordToggle(input){
  return { type: PASSWORD_TOGGLE, input: input};
}

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function CreateAccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PAGE:
      var newState = state.set('currentPage', action.index);
      return newState;
      break;
    case SET_EMAIL_VALIDATIONS:
      var newState = state.set('emailValidations', action.input);
      return newState;
      break;
    case SET_PASSWORD_VALIDATIONS:
      var newState = state.set('passwordValidations', action.input);
      return newState;
      break;
    case SET_FIRST_NAME_VALIDATIONS:
      var newState = state.set('firstNameValidations', action.input);
      return newState;
      break;
    case SET_LAST_NAME_VALIDATIONS:
      var newState = state.set('lastNameValidations', action.input);
      return newState;
      break;
    case SET_PHONE_NUMBER_VALIDATIONS:
      var newState = state.set('phoneNumberValidations', action.input);
      return newState;
      break;
    case SET_EMAIL:
      var currUser = state.get('currentUser');
      currUser.email = action.input;
      var newState = state.set('currentUser', currUser);
      return newState;
      break;
    case SET_PASSWORD:
      var currUser = state.get('currentUser');
      currUser.password = action.input;
      var newState = state.set('currentUser', currUser);
      return newState;
      break;
    case SET_FIRST_NAME:
      var currUser = state.get('currentUser');
      currUser.firstName = action.input;
      var newState = state.set('currentUser', currUser);
      return newState;
      break;
    case SET_LAST_NAME:
      var currUser = state.get('currentUser');
      currUser.lastName = action.input;
      var newState = state.set('currentUser', currUser);
      return newState;
      break;
    case SET_PHONE_NUMBER:
      var currUser = state.get('currentUser');
      currUser.phoneNumber = action.input;
      var newState = state.set('currentUser', currUser);
      return newState;
      break;
    case PASSWORD_TOGGLE:
     var newState = state.set('passwordToggle', action.input);
     return newState;
     break;
  }

  return state;
}
