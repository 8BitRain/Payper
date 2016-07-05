import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

// Initialize currentUser vars
var payment = {
  to: "",
  from: "",
  memo: "",
  frequency: "",
  totalCost: -1,
  singleCost: -1,
  totalPayments: -1,
  completedPayments: -1,
}

// Initialize state
const initialState = Map({
  payment,
});

// Action types
var SET_FROM,
    SET_TO,
    SET_MEMO,
    SET_FREQUENCY,
    SET_TOTAL_COST,
    SET_SINGLE_COST,
    SET_TOTAL_PAYMENTS,
    SET_COMPLETED_PAYMENTS;

// Action creators
export function setFrom(input) {
  return { type: SET_FROM, input: input };
};
export function setTo(input) {
  return { type: SET_TO, input: input };
};
export function setMemo(input) {
  return { type: SET_MEMO, input: input };
};
export function setFrequency(input) {
  return { type: SET_FREQUENCY, input: input };
};
export function setTotalCost(input) {
  return { type: SET_TOTAL_COST, input: input };
};
export function setSingleCost(input) {
  return { type: SET_SINGLE_COST, input: input };
};
export function setTotalPayments(input) {
  return { type: SET_TOTAL_PAYMENTS, input: input };
};
export function setCompletedPayments(input) {
  return { type: SET_COMPLETED_PAYMENTS, input: input };
};

/**
  *   Reducer
  *
  *   Passed a state and an action. Updates the appropriate section of the state
  *   tree based on that action and returns full state tree.
  *
**/
export default function CreateAccountReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_FROM:
      var payment = state.get('payment');
      payment.from = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_TO:
      var payment = state.get('payment');
      payment.to = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_MEMO:
      var payment = state.get('payment');
      payment.memo = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_FREQUENCY:
      var payment = state.get('payment');
      payment.frequency = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_TOTAL_COST:
      var payment = state.get('payment');
      payment.totalCost = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_SINGLE_COST:
      var payment = state.get('payment');
      payment.singleCost = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_TOTAL_PAYMENTS:
      var payment = state.get('payment');
      payment.totalPayments = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
    case SET_COMPLETED_PAYMENTS:
      var payment = state.get('payment');
      payment.completedPayments = action.input;
      var newState = state.set('payment', payment);
      return newState;
      break;
  }

  return state;
}
