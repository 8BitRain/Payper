import {connect} from 'react-redux';
import * as dispatchFunctions from  './LandingScreenState';
import LandingScreenView from './LandingScreenView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';

/**
  *   Connect function for LandingScreenView.js
**/
export default connect(
  state => ({

  }),
  dispatch => ({
    // Handles pagination

  })
)(LandingScreenView);
/* END Connect function for landingScreenView.js */
