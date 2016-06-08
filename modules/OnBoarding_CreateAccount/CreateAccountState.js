import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize currentUser vars
var currentUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber:""
}

var passwordValidations = {
  length: false,
  upper: false,
  lower: false,
  num: false,
  sym: false
}

// Initialize state
const initialState = Map({
  currentUser,
  currentPage: 0,
  passwordValidations
});

// Action types
const SET_PAGE = 'SET_PAGE';
const SET_PASSWORD_VALIDATIONS = 'SET_PASSWORD_VALIDATIONS';

// Action creators
export function setPage(index) {
  console.log("it works!");
  return { type: SET_PAGE, index: index };
};

export function setPasswordValidations(input) {
  return { type: SET_PASSWORD_VALIDATIONS, input: input };
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
    case SET_PASSWORD_VALIDATIONS:
      var newState = state.set('passwordValidations', action.input);
      console.log("New state: " + newState);
      return newState;
      break;
  }

  return state;
}
