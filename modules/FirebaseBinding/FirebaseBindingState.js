import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Helpers
import * as Firebase from '../../services/Firebase';

// Initialize state
var test = "initial value";

const initialState = Map({
  test
});

// Action types
const SET_TEST = 'SET_TEST';

// Action creators
export function setTest(input) {
  console.log("INPUT", input);
  return { type: SET_TEST, input: input };
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
    case SET_TEST:
      console.log("INPUT2", action.input);
      var newState = state.set('test', action.input);
      return newState;
      break;
  }
  return state;
}
