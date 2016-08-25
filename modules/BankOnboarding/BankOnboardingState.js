import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize dwollaCustomer vars
var dwollaCustomer = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  dob: "",
  ssn: ""
};

var phoneValidations = {
  length: false,
  valid: false
};

var emailValidations = {
  length: false,
  valid: false
};

var cfirstNameValidations = {
  capitalized: false,
  format: false,
  valid: false
};

var clastNameValidations = {
  capitalized: false,
  format: false,
  valid: false
};

var basicInfoValidations = {
  phoneValidations: false,
  emailValidations: false,
  cfirstNameValidations: true,
  clastNameValidations: true,
  valid: false
};


// Initialize state
const initialState = Map({
    activeFirebaseListeners: [],
    dwollaCustomer,
    currentPagex: 0,
    startIav: '',
    startMain: false,
    startVerifyMicroDeposit: false,
    firebase_token: '',
    phoneValidations,
    emailValidations,
    cfirstNameValidations,
    clastNameValidations,
    loading: false,
    doneLoading: false
});

// Action types
const SET_PAGEX = 'SET_PAGEX',
      SET_IAV = 'SET_IAV',
      SET_START_MAIN = 'SET_START_MAIN',
      SET_VERIFY_MICRODEPOSIT = 'SET_VERIFY_MICRODEPOSIT',
      SET_FIREBASETOKEN = "SET_FIREBASETOKEN",
      SET_FIRST_NAME = 'SET_FIRST_NAME',
      SET_LAST_NAME = 'SET_LAST_NAME',
      SET_EMAIL = 'SET_EMAIL',
      SET_PHONE = 'SET_PHONE',
      SET_ADDRESS = 'SET_ADDRESS',
      SET_ZIP = 'SET_ZIP',
      SET_STATE = 'SET_STATE',
      SET_CITY = 'SET_CITY',
      SET_DOB = 'SET_DOB',
      SET_SSN = 'SET_SSN',
      SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_FIREBASE_LISTENERS',
      SET_PHONE_VALIDATIONS = 'SET_PHONE_VALIDATIONS',
      SET_FIRST_NAME_VALIDATIONS = 'SET_FIRST_NAME_VALIDATIONS',
      SET_LAST_NAME_VALIDATIONS = 'SET_LAST_NAME_VALIDATIONS',
      SET_BASIC_INFO_VALIDATIONS = 'SET_BASIC_INFO_VALIDATIONS',
      SET_EMAIL_VALIDATIONS = 'SET_EMAIL_VALIDATION',
      SET_LOADING = 'SET_LOADING',
      SET_DONE_LOADING = 'SET_DONE_LOADING';


// Action creators
export function setPageX(index) {
  return { type: SET_PAGEX, index: index };
};

export function setPhoneValidations(index){
  return {type: SET_PHONE_VALIDATIONS, index: index};
};

export function setEmailValidations(index){
  return {type: SET_EMAIL_VALIDATIONS, index: index};
};

export function setBasicInfoValidations(index){
  return {type: SET_BASIC_INFO_VALIDATIONS, index: index};
};

export function setCFirstNameValidations(index){
  return {type: SET_FIRST_NAME_VALIDATIONS, index: index};
};

export function setCLastNameValidations(index){
  return {type: SET_LAST_NAME_VALIDATIONS, index: index};
};

export function setIav(index){
  return { type: SET_IAV, index: index};
};

export function setMain(index){
  return { type: SET_START_MAIN, index: index};
};

export function setVerifyMicroDeposit(index){
  return { type: SET_VERIFY_MICRODEPOSIT, index: index};
};

export function setFirstName(index){
  return { type: SET_FIRST_NAME, index: index};
};

export function setLastName(index){
  return { type: SET_LAST_NAME, index: index};
};


export function setEmail(index){
  return { type: SET_EMAIL, index: index};
};

export function setPhone(index){
  return { type: SET_PHONE, index: index};
};

export function setAddress(index){
  return { type: SET_ADDRESS, index: index};
};

export function setCity(index){
  return { type: SET_CITY, index: index};
};

export function setZip(index){
  return { type: SET_ZIP, index: index};
};

export function setState(index){
  return { type: SET_STATE, index: index};
};

export function setDob(index){
  return { type: SET_DOB, index: index};
};

export function setSSN(index){
  return { type: SET_SSN, index: index};
};

export function setFirebaseToken(index){
  return { type: SET_FIREBASETOKEN, index: index}
};

export function setLoading(index){
  return { type: SET_LOADING, index: index}
};

export function setDoneLoading(index){
  return { type: SET_DONE_LOADING, index: index}
};
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };




/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function BankOnboardingReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
    case SET_PAGEX:
      var newState = state.set('currentPagex', action.index);
      return newState;
      break;
    case SET_IAV:
      var newState = state.set('startIav', action.index);
      return newState;
      break;
    case SET_FIRST_NAME_VALIDATIONS:
      var newState = state.set('cfirstNameValidations', action.index);
      return newState;
      break;
    case SET_LAST_NAME_VALIDATIONS:
      var newState = state.set('clastNameValidations', action.index);
      return newState;
      break;
    case SET_EMAIL_VALIDATIONS:
      var newState = state.set('emailValidations', action.index);
      return newState;
      break;
    case SET_BASIC_INFO_VALIDATIONS:
      var newState = state.set('basicInfoValidations', action.index);
      return newState;
      break;
    case SET_START_MAIN:
      var newState = state.set('startMain', action.index);
      return newState;
      break;
    case SET_VERIFY_MICRODEPOSIT:
      var newState = state.set('startVerifyMicroDeposit', action.index);
      return newState;
      break;
    case SET_PHONE_VALIDATIONS:
      var newState = state.set('phoneValidations', action.index);
      return newState;
      break;
    case SET_FIREBASETOKEN:
      var newState = state.set('firebase_token', action.index);
      return newState;
      break;
    case SET_LOADING:
      var newState = state.set('loading', action.index);
      return newState;
      break;
    case SET_DONE_LOADING:
      var newState = state.set('done_loading', action.index);
      return newState;
      break;
    case SET_EMAIL:
      var customer = state.get('dwollaCustomer');
      customer.email = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_FIRST_NAME:
      var customer = state.get('dwollaCustomer');
      customer.firstName = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_LAST_NAME:
      var customer = state.get('dwollaCustomer');
      customer.lastName = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_PHONE:
      var customer = state.get('dwollaCustomer');
      customer.phone = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_ADDRESS:
      var customer = state.get('dwollaCustomer');
      customer.address = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_CITY:
      var customer = state.get('dwollaCustomer');
      customer.city = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_STATE:
      var customer = state.get('dwollaCustomer');
      customer.state = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_ZIP:
      var customer = state.get('dwollaCustomer');
      customer.zip = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_DOB:
      var customer = state.get('dwollaCustomer');
      customer.dob = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
    case SET_SSN:
      var customer = state.get('dwollaCustomer');
      customer.ssn = action.index;
      var newState = state.set('dwollaCustomer', customer);
      return newState;
      break;
  }

  return state;
}
