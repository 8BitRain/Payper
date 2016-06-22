import {connect} from 'react-redux';
import * as dispatchFunctions from  './TrackingState';
import TrackingView from './TrackingView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';

/**
  *   Connect function for TrackingScreen.js
**/
export default connect(
  state => ({

  }),
  dispatch => ({
    // Handles pagination

  })
)(TrackingView);
/* END Connect function for TrackingScreen.js */
