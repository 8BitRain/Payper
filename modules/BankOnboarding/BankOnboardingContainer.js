import {connect} from 'react-redux';
import * as dispatchFunctions from  './BankOnboardingState';
import BankOnboardingView from './BankOnboardingView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';

/**
  *   Connect function for BankOnboardingView.js
**/
export default connect(
  state => ({

  }),
  dispatch => ({
    // Handles pagination

  })
)(BankOnboardingView);
/* END Connect function for TrackingScreen.js */
