// Dependencies
import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop';


// Initialize state
const initialState = Map({
  amount,
  purpose,
  payments,
  recip_id,
  recip_name,
  recip_pic,
  sender_id,
  sender_name,
  sender_pic,
  type,
  token,
  confirmed
});

// Action types
var SET_AMOUNT,
    SET_PURPOSE,
    SET_PAYMENTS,
    SET_RECIP_ID,
    SET_RECIP_NAME,
    SET_RECIP_PIC,
    SET_SENDER_ID,
    SET_SENDER_NAME,
    SET_SENDER_PIC,
    SET_TYPE,
    SET_TOKEN,
    SET_CONFIRMED;

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
  }

  return state;
}
