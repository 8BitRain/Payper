// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';

// Initialize state
const initialState = Map({
  amount: null,
  purpose: null,
  payments: null,
  recip_id: null,
  recip_name: null,
  recip_pic: null,
  sender_id: null,
  sender_name: null,
  sender_pic: null,
  type: null,
  token: null,
  confirmed: false,
  invite: null,
  phoneNumber: null,
  info: {},
});

// Action types
var SET_AMOUNT = 'SET_AMOUNT',
    SET_PURPOSE = 'SET_PURPOSE',
    SET_PAYMENTS = 'SET_PAYMENTS',
    SET_RECIP_ID = 'SET_RECIP_ID',
    SET_RECIP_NAME = 'SET_RECIP_NAME',
    SET_RECIP_PIC = 'SET_RECIP_PIC',
    SET_SENDER_ID = 'SET_SENDER_ID',
    SET_SENDER_NAME = 'SET_SENDER_NAME',
    SET_SENDER_PIC = 'SET_SENDER_PIC',
    SET_TYPE = 'SET_TYPE',
    SET_TOKEN = 'SET_TOKEN',
    SET_CONFIRMED = 'SET_CONFIRMED',
    SET_INVITE = 'SET_INVITE',
    SET_PHONE_NUMBER = 'SET_PHONE_NUMBER',
    SET_INFO = 'SET_INFO';

// Action creators
export function amount(input) { return { type: SET_AMOUNT, input: input } };
export function purpose(input) { return { type: SET_PURPOSE, input: input } };
export function payments(input) { return { type: SET_PAYMENTS, input: input } };
export function recipID(input) { return { type: SET_RECIP_ID, input: input } };
export function recipName(input) { return { type: SET_RECIP_NAME, input: input } };
export function recipPic(input) { return { type: SET_RECIP_PIC, input: input } };
export function senderID(input) { return { type: SET_SENDER_ID, input: input } };
export function senderName(input) { return { type: SET_SENDER_NAME, input: input } };
export function senderPic(input) { return { type: SET_SENDER_PIC, input: input } };
export function type(input) { return { type: SET_TYPE, input: input } };
export function token(input) { return { type: SET_TOKEN, input: input } };
export function confirmed(input) { return { type: SET_CONFIRMED, input: input } };
export function invite(input) { return { type: SET_INVITE, input: input } };
export function phoneNumber(input) { return { type: SET_PHONE_NUMBER, input: input } };
export function info(input) { return { type: SET_INFO, input: input } };

// Set all values
export function all(input) {
  amount(input);
  purpose(input);
  payments(input);
  recipID(input);
  recipName(input);
  recipPic(input);
  senderID(input);
  senderName(input);
  senderPic(input);
  type(input);
  token(input);
  confirmed(input);
  invite(input);
  phoneNumber(input);
};

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function PaymentReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_AMOUNT:
      var newState = state.set('amount', action.input);
      return newState;
      break;
    case SET_PURPOSE:
      var newState = state.set('purpose', action.input);
      return newState;
      break;
    case SET_PAYMENTS:
      var newState = state.set('payments', action.input);
      return newState;
      break;
    case SET_RECIP_ID:
      var newState = state.set('recip_id', action.input);
      return newState;
      break;
    case SET_RECIP_NAME:
      var newState = state.set('recip_name', action.input);
      return newState;
      break;
    case SET_RECIP_PIC:
      var newState = state.set('recip_pic', action.input);
      return newState;
      break;
    case SET_SENDER_ID:
      var newState = state.set('sender_id', action.input);
      return newState;
      break;
    case SET_SENDER_NAME:
      var newState = state.set('sender_name', action.input);
      return newState;
      break;
    case SET_SENDER_PIC:
      var newState = state.set('sender_pic', action.input);
      return newState;
      break;
    case SET_TYPE:
      var newState = state.set('type', action.input);
      return newState;
      break;
    case SET_TOKEN:
      var newState = state.set('token', action.input);
      return newState;
      break;
    case SET_CONFIRMED:
      var newState = state.set('confirmed', action.input);
      return newState;
      break;
    case SET_INVITE:
      var newState = state.set('invite', action.input);
      return newState;
      break;
    case SET_PHONE_NUMBER:
      var newState = state.set('phoneNumber', action.input);
      return newState;
      break;
    case SET_INFO:
      var newState = state.set('info', action.input);
      return newState;
      break;
  }

  return state;
}
