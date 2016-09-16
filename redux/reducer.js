import {Map} from 'immutable';
import {combineReducers} from 'redux-loop';
/*import NavigationStateReducer from '../modules/navigation/NavigationState';
import AuthStateReducer from '../modules/auth/AuthState';
import CounterStateReducer from '../modules/counter/CounterState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';*/
import CreateAccountReducer from '../modules/CreateAccount/CreateAccountState';
import BankOnboardingReducer from '../modules/BankOnboarding/BankOnboardingState';
import FirebaseBindingReducer from '../modules/FirebaseBinding/FirebaseBindingState';
import LandingScreenReducer from '../modules/LandingScreen/LandingScreenState';
import UserSearchReducer from '../modules/UserSearch/UserSearchState';
import MainReducer from '../modules/Main/MainState';
import PaymentsReducer from '../modules/Payments/PaymentsState';
import PaymentReducer from '../modules/CreatePayment/CreatePaymentState';
import FundingSourcesReducer from '../modules/FundingSources/FundingSourcesState';
import InviteReducer from '../modules/Invite/InviteState';


const reducers = {
  // Authentication/login state
  /*auth: AuthStateReducer,

  // Counter sample app state. This can be removed in a live application
  counter: CounterStateReducer,

  // @NOTE: By convention, the navigation state must live in a subtree called
  //`navigationState`
  navigationState: NavigationStateReducer,

  session: SessionStateReducer*/

  main: MainReducer,
  createAccount: CreateAccountReducer,
  bankOnboarding: BankOnboardingReducer,
  firebaseBinding: FirebaseBindingReducer,
  landingScreen: LandingScreenReducer,
  userSearch: UserSearchReducer,
  payments: PaymentsReducer,
  payment: PaymentReducer,
  fundingSources: FundingSourcesReducer,
  invite: InviteReducer,

};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
  reducers,
  immutableStateContainer,
  getImmutable,
  setImmutable
);

export default function mainReducer(state, action) {
  /*if (action.type === RESET_STATE) {
    return namespacedReducer(action.payload, action);
  }*/

  return namespacedReducer(state || void 0, action);
}
