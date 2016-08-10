import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize newUser vars
var newUser = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    numNotifications: 0,
    token: "",
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
  phoneValidations = {
    length: false,
    valid: false
  };

// Initialize state
const initialState = Map({
  newUser,
  currentPage: 0,
  provider: '',
  token: '',
  startIav: '',
  passwordValidations,
  emailValidations,
  firstNameValidations,
  lastNameValidations,
  phoneValidations
});

// Action types
const SET_PAGE = 'SET_PAGE',
      SET_IAV = 'SET_IAV',
      SET_EMAIL_VALIDATIONS = 'SET_EMAIL_VALIDATIONS',
      SET_PASSWORD_VALIDATIONS = 'SET_PASSWORD_VALIDATIONS',
      SET_FIRST_NAME_VALIDATIONS = 'SET_FIRST_NAME_VALIDATIONS',
      SET_LAST_NAME_VALIDATIONS = 'SET_LAST_NAME_VALIDATIONS',
      SET_PHONE_VALIDATIONS = 'SET_PHONE_VALIDATIONS',
      SET_PROVIDER = 'SET_PROVIDER',
      SET_EMAIL = 'SET_EMAIL',
      SET_PASSWORD = 'SET_PASSWORD',
      SET_FIRST_NAME = 'SET_FIRST_NAME',
      SET_LAST_NAME = 'SET_LAST_NAME',
      SET_TOKEN = 'SET_TOKEN',
      SET_PHONE = 'SET_PHONE';

// Action creators
export function setPage(index) {
  return { type: SET_PAGE, index: index };
};

export function setToken(index) {
  return { type: SET_TOKEN, index: index };
};

export function setIav(index){
  return { type: SET_IAV, index: index};
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

export function setPhoneValidations(input) {
  return { type: SET_PHONE_VALIDATIONS, input: input };
};

export function setProvider(input) {
  return { type: SET_PROVIDER, input: input };
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

export function setPhone(input) {
  return { type: SET_PHONE, input: input };
};

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
    case SET_IAV:
      var newState = state.set('startIav', action.index);
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
    case SET_PHONE_VALIDATIONS:
      var newState = state.set('phoneValidations', action.input);
      return newState;
      break;
    case SET_PROVIDER:
      var newState = state.set('provider', action.input);
      return newState;
      break;
    case SET_TOKEN:
      var newState = state.set('token', action.input);
      return newState;
      break;
    case SET_EMAIL:
      var currUser = state.get('newUser');
      currUser.email = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
    case SET_PASSWORD:
      var currUser = state.get('newUser');
      currUser.password = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
    case SET_FIRST_NAME:
      var currUser = state.get('newUser');
      currUser.firstName = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
    case SET_LAST_NAME:
      var currUser = state.get('newUser');
      currUser.lastName = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
    case SET_PHONE:
      var currUser = state.get('newUser');
      currUser.phone = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
  }

  return state;
}
