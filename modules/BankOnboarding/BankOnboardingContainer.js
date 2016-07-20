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
    // Tracks pagination
    //currentPage: state.getIn(['createAccount', 'currentPage']),

    //Tracks whether or not iav has been started
    startIav: state.getIn(['bankOnboarding', 'startIav']),
  }),
  dispatch => ({

      dispatchSetIav(input){
        dispatch(dispatchFunctions.setIav(input));
      }
    // Handles pagination
    // Handles pagination
    /*dispatchSetPage(index, direction, validations, input) {
      if (direction == "forward") {
        var currentPage = index - 1;
        // console.log("input: " + input);
        // console.log("index: " + index);
        // console.log("direction: " + direction);
        // console.log("validations: " + JSON.stringify(validations));
        if (validations.valid) {
          switch (currentPage) {
            //
            case 0:
              //dispatch(dispatchFunctions.setEmail(input));
              break;
            //
            case 1:
              //dispatch(dispatchFunctions.setPassword(input));
              break;
            //
            case 2:
              //dispatch(dispatchFunctions.setFirstName(input));
              break;
            //
            case 3:
              //dispatch(dispatchFunctions.setLastName(input));
              break;
            //
            case 4:
              //dispatch(dispatchFunctions.setPhoneNumber(input));
              break;
          }
          dispatch(dispatchFunctions.setPage(index));
        }
      }else {
        dispatch(dispatchFunctions.setPage(index));
      }
    } //End of dispatchSetPage */
  })
)(BankOnboardingView);
/* END Connect function for TrackingScreen.js */
