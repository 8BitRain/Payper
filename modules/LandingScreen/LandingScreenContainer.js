import {connect} from 'react-redux';
import * as dispatchFunctions from  '../CreateAccount/CreateAccountState';
import * as selfDispatchFunctions from './LandingScreenState';
import LandingScreenView from './LandingScreenView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';



/**
  *   Connect function for LandingScreenView.js
**/
export default connect(
  state => ({
    //Provider information
    provider: state.getIn(['landingScreen', 'provider']),
    token: state.getIn(['landingScreen'], 'token')
  }),
  dispatch => ({
    //Update provider (How the account view container was reached)
    dispatchSetProvider(input){
      dispatch(dispatchFunctions.setProvider(input));
    },
    dispatchSetToken(input){
      dispatch(selfDispatchFunctions.setToken(input));
    }

  })
)(LandingScreenView);
/* END Connect function for landingScreenView.js */
