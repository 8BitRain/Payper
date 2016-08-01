// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { ListView, DataSource } from 'react-native';

// Clone for state updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// Initialize state
const initialState = Map({
  activeFirebaseListeners: [],
  allContacts: EMPTY_DATA_SOURCE.cloneWithRows([]),
  filteredContacts: EMPTY_DATA_SOURCE.cloneWithRows([]),
  selectedContact: {
    username: "",
    first_name: "",
    last_name: "",
    profile_pic: "",
    type: "",
  },
});

// Action types
const SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_FIREBASE_LISTENERS',
      SET_ALL_CONTACTS = 'SET_ALL_CONTACTS',
      SET_FILTERED_CONTACTS = 'SET_FILTERED_CONTACTS',
      SET_SELECTED_CONTACT = 'SET_SELECTED_CONTACT';

// Action creators
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };
export function allContacts(input) { return {type: SET_ALL_CONTACTS, input: input} };
export function filteredContacts(input) { return {type: SET_FILTERED_CONTACTS, input: input} };
export function selectedContact(input) { return {type: SET_SELECTED_CONTACT, input: input} };

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
    case SET_ALL_CONTACTS:
      var newState = state.set('allContacts', EMPTY_DATA_SOURCE.cloneWithRows(action.input));
      return newState;
      break;
    case SET_FILTERED_CONTACTS:
      var newState = state.set('filteredContacts', EMPTY_DATA_SOURCE.cloneWithRows(action.input));
      return newState;
      break;
    case SET_SELECTED_CONTACT:
      var newState = state.set('selectedContact', action.input);
      return newState;
      break;
  }
  return state;
}
