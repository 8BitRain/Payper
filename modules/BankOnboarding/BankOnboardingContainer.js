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
    /*Bank Onboarding State Variables*/
    activeFirebaseListeners: state.getIn(['bankOnboarding', 'activeFirebaseListeners']),
    startIav: state.getIn(['bankOnboarding', 'startIav']),
    firebase_token: state.getIn(['createAccount', 'token']),
    dwollaCustomer: state.getIn(['bankOnboarding', 'dwollaCustomer']),
    // Tracks pagination
    currentPagex: state.getIn(['bankOnboarding', 'currentPagex']),

    /*Create Account State Variables*/
    newUser: state.getIn(['createAccount', 'newUser'])

  }),
  dispatch => ({
      listen(endpoints) {
        Firebase.listenTo(endpoints, (response) => {
          console.log("%cFirebase listener received:", "color:orange;font-weight:900;");
          console.log(response);
          switch (response.endpoint.split("/")[0]) {
            case "IAV":
              if(response.value != null){
                console.log(response.value.iav);
                dispatch(dispatchFunctions.setIav(response.value.iav));
                break;
              }
          }
        });
          dispatch(dispatchFunctions.activeFirebaseListeners(endpoints));
        },

      stopListening(endpoints) {
        Firebase.stopListeningTo(endpoints);
        dispatch(dispatchFunctions.activeFirebaseListeners([]));
      },

      dispatchSetIav(input){
        dispatch(dispatchFunctions.setIav(input));
      },
      dispatchSetFirebaseToken(input){
        dispatch(dispatchFunctions.setFirebaseToken(input));
      },
      dispatchSetFirstName(input){
        dispatch(dispatchFunctions.setFirstName(input));
      },
      dispatchSetLastName(input){
        dispatch(dispatchFunctions.setLastName(input));
      },
      dispatchSetEmail(input){
        dispatch(dispatchFunctions.setEmail(input));
      },
      dispatchSetPhone(input){
        dispatch(dispatchFunctions.setPhone(input));
      },
      dispatchSetAddress(input){
        dispatch(dispatchFunctions.setAddress(input));
      },
      dispatchSetCity(input){
        dispatch(dispatchFunctions.setCity(input));
      },
      dispatchSetZip(input){
        dispatch(dispatchFunctions.setZip(input));
      },
      dispatchSetState(input){
        dispatch(dispatchFunctions.setState(input));
      },
      dispatchSetDob(input){
        dispatch(dispatchFunctions.setDob(input));
      },
      dispatchSetSSN(input){
        dispatch(dispatchFunctions.setSSN(input));
      },


      // Handles pagination
      dispatchSetPageX(index, direction) {
        dispatch(dispatchFunctions.setPageX(index));
      }
  })
)(BankOnboardingView);
/* END Connect function for TrackingScreen.js */
