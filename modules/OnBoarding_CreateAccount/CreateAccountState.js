
import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

var currentUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber:""
}
// Initial state
const initialState = Map({
  currentUser,
  currentPage: 4
});

// Actions
const NEXT_PAGE = 'NEXT_PAGE';
const PREVIOUS_PAGE= 'PREVIOUS_PAGE';


// Action creators
export function nextPage() {
  return {type: NEXT_PAGE};
}

export function prevPage() {
  return {type: PREVIOUS_PAGE};
}



// Reducer
export default function CreateAccountReducer(state = initialState, action = {}) {
  console.log(state);
  return state;
}
