import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';


// Initialize state
const initialState = Map({
    provider: '',
    token: ''

});

// Action types
const SET_PROVIDER = 'SET_PROVIDER',
      SET_TOKEN = 'SET_TOKEN';

// Action creators

export function setProvider(input) {
  return { type: SET_PROVIDER, input: input };
};

export function setToken(input) {
  return { type: SET_TOKEN, input: input };
};


/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function LandingScreenReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROVIDER:
      var newState = state.set('provider', action.input);
      return newState;
      break;
    case SET_TOKEN:
      var newState = state.set('token', action.input);
      return newState;
      break;
  }

  return state;
}
