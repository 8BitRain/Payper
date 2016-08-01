/**
  *   Where'd you leave off?
  *
  *   State has been set up
  *   View container has been set up
  *   You just created the "PaymentFLow" module and were about to start refactoring
  *     MainView.js to be more modularized and to utilize new Firebase=>Redux linking
**/


// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';

// Initialize state
const initialState = Map({
  activeFirebaseListeners: [],
  loggedIn: false,
  currentUser: {},
  flags: "",
  notifications: [],
  numUnseenNotifications: -1,
  header: {
    types: {
      "paymentIcons": false,
      "circleIcons": false,
      "settingsIcon": true,
      "closeIcon": false,
      "flowTabs": false,
    },
    index: null,
    numCircles: null,
    title: "Notifications",
  },
  sideMenuIsOpen: false,
  currentPage: "notifications",
});

// Action types
const SET_ACTIVE_FIREBASE_LISTENERS = 'SET_ACTIVE_FIREBASE_LISTENERS',
      SET_CURRENT_USER = 'SET_CURRENT_USER',
      SET_FLAGS = 'SET_FLAGS'
      SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
      SET_NUM_UNSEEN_NOTIFICATIONS = 'SET_NUM_UNSEEN_NOTIFICATIONS',
      SET_SIGNED_IN = 'SET_SIGNED_IN',
      SET_HEADER = 'SET_HEADER',
      SET_SIDE_MENU_IS_OPEN = 'SET_SIDE_MENU_IS_OPEN',
      SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';


// Action creators
export function activeFirebaseListeners(input) { return {type: SET_ACTIVE_FIREBASE_LISTENERS, input: input} };
export function currentUser(input) { return {type: SET_CURRENT_USER, input: input} };
export function flags(input) { return {type: SET_FLAGS, input: input} };
export function signedIn(input) { return {type: SET_SIGNED_IN, input: input} };
export function notifications(input) { return {type: SET_NOTIFICATIONS, input: input} };
export function numUnseenNotifications(input) { return {type: SET_NUM_UNSEEN_NOTIFICATIONS, input: input} };
export function header(input) { return {type: SET_HEADER, input: input} };
export function sideMenuIsOpen(input) { return {type: SET_SIDE_MENU_IS_OPEN, input: input} };
export function currentPage(input) { return {type: SET_CURRENT_PAGE, input: input} };

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function MainReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ACTIVE_FIREBASE_LISTENERS:
      var newState = state.set('activeFirebaseListeners', action.input);
      return newState;
      break;
    case SET_SIGNED_IN:
      var newState = state.set('signedIn', action.input);
      return newState;
      break;
    case SET_CURRENT_USER:
      var newState = state.set('currentUser', action.input);
      return newState;
      break;
    case SET_FLAGS:
      var newState = state.set('flags', action.input);
      return newState;
      break;
    case SET_NOTIFICATIONS:
      var newState = state.set('notifications', action.input);
      return newState;
      break;
    case SET_NUM_UNSEEN_NOTIFICATIONS:
      var newState = state.set('numUnseenNotifications', action.input);
      return newState;
      break;
    case SET_HEADER:
      var newState = state.set('header', action.input);
      return newState;
      break;
    case SET_SIDE_MENU_IS_OPEN:
      var newState = state.set('sideMenuIsOpen', action.input);
      return newState;
      break;
    case SET_CURRENT_PAGE:
      var newState = state.set('currentPage', action.input);
      return newState;
      break;
  }
  return state;
}
