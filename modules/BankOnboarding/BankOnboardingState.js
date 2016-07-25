import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize currentUser vars


// Initialize state
const initialState = Map({
    currentPage: 0,
    startIav: '',
    firebase_token: ''
});

// Action types
const SET_PAGE = 'SET_PAGE',
      SET_IAV = 'SET_IAV',
      SET_FIREBASETOKEN = "SET_FIREBASETOKEN";


// Action creators
export function setPage(index) {
  return { type: SET_PAGE, index: index };
};

export function setIav(index){
  return { type: SET_IAV, index: index};
};

export function setFirebaseToken(index){
  return { type: SET_FIREBASETOKEN, index: index}
}


/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function BankOnboardingReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PAGE:
      var newState = state.set('currentPage', action.index);
      return newState;
      break;

    case SET_IAV:
      var newState = state.set('startIav', action.index);
      return newState;
      break;
    case SET_FIREBASETOKEN:
      var newState = state.set('firebase_token', action.index);
      return newState;
      break;

  }

  return state;
}
