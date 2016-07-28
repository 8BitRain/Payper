// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { ListView, DataSource } from 'react-native';

// Clone for state updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// Initialize state
const initialState = Map({
  activeFirebaseListeners: ['TestContacts/auserid'],
  contacts: EMPTY_DATA_SOURCE.cloneWithRows([]),
  empty: true
});

// Action types
const SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_FIREBASLISTENERS',
      SET_CONTACTS = 'SET_CONTACTS',
      SET_EMPTY = 'SET_EMPTY';

// Action creators
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };
export function contacts(input) { return {type: SET_CONTACTS, input: input} };
export function empty(input) { return {type: SET_EMPTY, input: input} };

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function PredictiveSearchReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
    case SET_CONTACTS:
      var newState = state.set('contacts', EMPTY_DATA_SOURCE.cloneWithRows(action.input));
      return newState;
      break;
    case SET_EMPTY:
      var newState = state.set('empty', action.input);
      return newState;
      break;
  }
  return state;
}
