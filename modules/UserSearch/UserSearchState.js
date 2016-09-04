// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { ListView, DataSource } from 'react-native';

// Clone for state updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

// Initialize state
const initialState = Map({
  activeFirebaseListeners: [],
  allContactsArray: [],
  allContactsMap: EMPTY_DATA_SOURCE.cloneWithRowsAndSections([]),
  filteredContactsMap: EMPTY_DATA_SOURCE.cloneWithRowsAndSections([]),
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
      SET_ALL_CONTACTS_ARRAY = 'SET_ALL_CONTACTS_ARRAY',
      SET_ALL_CONTACTS_MAP = 'SET_ALL_CONTACTS_MAP',
      SET_FILTERED_CONTACTS_MAP = 'SET_FILTERED_CONTACTS',
      SET_SELECTED_CONTACT = 'SET_SELECTED_CONTACT';

// Action creators
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };
export function allContactsArray(input) { return {type: SET_ALL_CONTACTS_ARRAY, input: input} };
export function allContactsMap(input) { return {type: SET_ALL_CONTACTS_MAP, input: input} };
export function filteredContactsMap(input) { return {type: SET_FILTERED_CONTACTS_MAP, input: input} };
export function selectedContact(input) { return {type: SET_SELECTED_CONTACT, input: input} };

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function UserSearch(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
    case SET_ALL_CONTACTS_ARRAY:
      var newState = state.set('allContactsArray', action.input);
      return newState;
      break;
    case SET_ALL_CONTACTS_MAP:
      var newState = state.set('allContactsMap', EMPTY_DATA_SOURCE.cloneWithRowsAndSections(action.input));
      return newState;
      break;
    case SET_FILTERED_CONTACTS_MAP:
      var newState = state.set('filteredContactsMap', EMPTY_DATA_SOURCE.cloneWithRowsAndSections(action.input));
      return newState;
      break;
    case SET_SELECTED_CONTACT:
      var newState = state.set('selectedContact', action.input);
      return newState;
      break;
  }
  return state;
}
