import {connect} from 'react-redux';
import LandingScreenView from './LandingScreenView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';

import * as dispatchFunctions from  '../CreateAccount/CreateAccountState';
import * as selfDispatchFunctions from './LandingScreenState';
import * as setInMain from '../Main/MainState';

/**
  *   Connect function for LandingScreenView.js
**/
export default connect(
  state => ({
    provider: state.getIn(['landingScreen', 'provider']),
    newUser: state.getIn(['createAccount', 'newUser']),
    currentUser: state.getIn(['main', 'currentUser'])
  }),
  dispatch => ({
    setUser(user) { dispatch(setInMain.user(user)); },
    dispatchSetProvider(input) { dispatch(dispatchFunctions.setProvider(input)); },
    dispatchSetNewUserToken(input) { dispatch(dispatchFunctions.setNewUserToken(input)); }
  })
)(LandingScreenView);
/* END Connect function for landingScreenView.js */
