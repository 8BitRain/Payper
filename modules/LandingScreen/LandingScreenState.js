import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';


// Initialize state
const initialState = Map({
    provider: '',
    newUser: '',
    loading: false

});

// Action types
const SET_PROVIDER = 'SET_PROVIDER',
      SET_NEWUSER_TOKEN = 'SET_NEWUSER_TOKEN',
      SET_LOADING = 'SET_LOADING';

// Action creators

export function setProvider(input) {
  return { type: SET_PROVIDER, input: input };
};

export function setNewUserToken(input) {
  return { type: SET_NEWUSER_TOKEN, input: input };
};

export function setLoading(input) {
  return { type: SET_LOADING, input: input };
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
    case SET_LOADING:
      var newState = state.set('loading', action.input);
      return newState;
      break;
    case SET_NEWUSER_TOKEN:
      var currUser = state.get('newUser');
      currUser.token = action.input;
      var newState = state.set('newUser', currUser);
      return newState;
      break;
  }

  return state;
}
