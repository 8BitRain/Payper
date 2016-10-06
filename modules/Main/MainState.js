// Dependencies
import { Map } from 'immutable';
import User from '../../classes/User';
import * as _ from 'lodash';

// Initialize state
const initialState = Map({
  currentUser: new User({ enableLogs: true })
});

// Action types
const SET_CURRENT_USER = 'SET_CURRENT_USER',
      UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

// Action creators
export function setCurrentUser(input) {return {type: SET_CURRENT_USER, input: input}};
export function updateCurrentUser(input) {return {type: UPDATE_CURRENT_USER, input: input}};

export default function MainReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CURRENT_USER:
      var newState = state.set('currentUser', action.input);
      return newState;
    break;
    case UPDATE_CURRENT_USER:
      var user = state.get('currentUser');
      var clone = Object.create(Object.getPrototypeOf(user));
      for (var k in user) clone[k] = user[k];
      clone.update(action.input);
      var newState = state.set('currentUser', clone);
      return newState;
    break;
  }
  return state;
}
