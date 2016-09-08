// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';
import { ListView, DataSource } from 'react-native';

// Clone for state updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// Initialize state
const initialState = Map({
  activeFirebaseListeners: [],
  incomingPayments: EMPTY_DATA_SOURCE.cloneWithRows([]),
  outgoingPayments: EMPTY_DATA_SOURCE.cloneWithRows([]),
  globalPayments: EMPTY_DATA_SOURCE.cloneWithRows([]),
  isEmpty: true,
  activeTab: "tracking",
  activeFilter: "incoming",
  flags: "",
  newUser:'',
  startIav: ''
});

// Action types
const SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_FIREBASE_LISTENERS',
      SET_INCOMING_PAYMENTS = 'SET_INCOMING_PAYMENTS',
      SET_OUTGOING_PAYMENTS = 'SET_OUTGOING_PAYMENTS',
      SET_GLOBAL_PAYMENTS = 'SET_GLOBAL_PAYMENTS',
      SET_IS_EMPTY = 'SET_IS_EMPTY',
      SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
      SET_IAV = 'SET_IAV',
      SET_NEWUSER_TOKEN = 'SET_NEWUSER_TOKEN',
      SET_ACTIVE_FILTER = 'SET_ACTIVE_FILTER';

// Action creators
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };
export function incomingPayments(input) { return {type: SET_INCOMING_PAYMENTS, input: EMPTY_DATA_SOURCE.cloneWithRows(input)} };
export function outgoingPayments(input) { return {type: SET_OUTGOING_PAYMENTS, input: EMPTY_DATA_SOURCE.cloneWithRows(input)} };
export function globalPayments(input) { return {type: SET_GLOBAL_PAYMENTS, input: EMPTY_DATA_SOURCE.cloneWithRows(input)} };
export function isEmpty(input) { return {type: SET_IS_EMPTY, input: input} };
export function activeTab(input) { return {type: SET_ACTIVE_TAB, input: input} };
export function activeFilter(input) { return {type: SET_ACTIVE_FILTER, input: input} };
export function setNewUserToken(input) { return { type: SET_NEWUSER_TOKEN, input: input } };
export function setIav(index){ return { type: SET_IAV, index: index} };

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function PaymentsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
    case SET_INCOMING_PAYMENTS:
      var newState = state.set('incomingPayments', action.input);
      return newState;
      break;
    case SET_OUTGOING_PAYMENTS:
      var newState = state.set('outgoingPayments', action.input);
      return newState;
      break;
    case SET_GLOBAL_PAYMENTS:
      var newState = state.set('globalPayments', action.input);
      return newState;
      break;
    case SET_IS_EMPTY:
      var newState = state.set('isEmpty', action.input);
      return newState;
      break;
    case SET_ACTIVE_TAB:
      var newState = state.set('activeTab', action.input);
      return newState;
      break;
    case SET_ACTIVE_FILTER:
      var newState = state.set('activeFilter', action.input);
      return newState;
      break;
    case SET_IAV:
      var newState = state.set('startIav', action.input);
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
