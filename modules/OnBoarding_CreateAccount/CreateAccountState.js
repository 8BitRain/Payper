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

// Initialize state
const initialState = Map({
  currentUser,
  currentPage: 0
});

// Action types
const NEXT_PAGE = 'NEXT_PAGE';
const PREVIOUS_PAGE= 'PREVIOUS_PAGE';
const SET_PAGE = 'SET_PAGE';

// Action creators
export function switchPage(index) {
  console.log("switchPage() with index: " + index);
  return { type: SWITCH_PAGE, index: index };
}

export function prevPage() {
  return { type: PREVIOUS_PAGE };
}

export function setPage(index) {
  console.log("it works!");
  return { type: SET_PAGE, index: index };
}

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
  }

  return state;
}
