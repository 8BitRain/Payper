// import {Map} from 'immutable';
// import {loop, Effects} from 'redux-loop';
//
// // Initialize currentUser vars
// var payment = {
//   to: "",
//   from: "",
//   memo: "",
//   frequency: "",
//   totalCost: -1,
//   singleCost: -1,
//   totalPayments: -1,
//   completedPayments: -1,
// }
//
// // Initialize state
// const initialState = Map({
//   payment,
// });
//
// // Action types
// var SET_USER;
//
// // Action creators
// export function setFrom(input) {
//   return { type: SET_FROM, input: input };
// };
//
// /**
//   *   Reducer
//   *
//   *   Passed a state and an action. Updates the appropriate section of the state
//   *   tree based on that action and returns full state tree.
//   *
// **/
// export default function CreateAccountReducer(state = initialState, action = {}) {
//   switch (action.type) {
//     case SET_USER:
//       var payment = state.get('payment');
//       var user = action.input;
//       var newState = state.set('user', user);
//       return newState;
//       break;
//   }
//
//   return state;
// }
