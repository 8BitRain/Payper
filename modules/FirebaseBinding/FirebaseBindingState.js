import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Helpers
import * as Firebase from '../../services/Firebase';

// Initialize state
const initialState = Map({
  valueOne: "1",
  valueTwo: "2",
  activeFirebaseListeners: ['TestValueOne', "TestValueTwo"]
});

// Action types
const SET_VALUE_ONE = 'SET_VALUE_ONE',
      SET_VALUE_TWO = 'SET_VALUE_TWO',
      SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_LISTENERS';

// Action creators
export function setValueOne(input) {
  return { type: SET_VALUE_ONE, input: input };
};

export function setValueTwo(input) {
  return { type: SET_VALUE_TWO, input: input };
};

export function setactiveFirebaseListeners(input) {
  return { type: SET_ACTIVE_FIREBASE_LISTENERS, input: input };
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
    case SET_VALUE_ONE:
      var newState = state.set('valueOne', action.input);
      return newState;
      break;
    case SET_VALUE_TWO:
      var newState = state.set('valueTwo', action.input);
      return newState;
      break;
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
  }
  return state;
}
