import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize currentUser vars
var currentUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber:""
  },
  passwordValidations = {
    length: false,
    upper: false,
    lower: false,
    num: false,
    sym: false
  },
  emailValidations = {
    duplicate: false,
    format: false
  },
  firstNameValidations = {
    capitalized: false,
    format: false
  },
  lastNameValidations = {
    capitalized: false,
    format: false
  },
  phoneNumberValidations = {
    length: false
  };

// Initialize state
const initialState = Map({
  currentUser,
  currentPage: 0,
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
      SET_PHONE_NUMBER_VALIDATIONS = 'SET_PHONE_NUMBER_VALIDATIONS';

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

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
  *   TODO: implement partial state tree manipulation
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
      var newState = state.set('setPhoneNumberValidations', action.input);
      return newState;
      break;
  }

  return state;
}
