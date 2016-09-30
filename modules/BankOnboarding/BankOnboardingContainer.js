// Dependencies
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Components
import BankOnboardingView from './BankOnboardingView';

// Helpers
import Validators from '../../helpers/validators';
import * as Lambda from '../../services/Lambda';
import * as Firebase from '../../services/Firebase';

// Dispatch functions
import * as dispatchFunctions from  './BankOnboardingState';
import * as setInFundingSources from '../FundingSources/FundingSourcesState';

/**
  *   Connect function for BankOnboardingView.js
**/
var dispatchList = {
  iav: false,
  retry: false,
  fullSSN: false,
  suspended: false,
  document: false,
  doneListening: false
}

// Used to keep track of which listeners we'll disable in stopListening()
var ACTIVE_LISTENERS = [];

export default connect(
  state => ({

    /*Bank Onboarding State Variables*/
    activeFirebaseListeners: state.getIn(['bankOnboarding', 'activeFirebaseListeners']),
    startIav: state.getIn(['bankOnboarding', 'startIav']),
    startMain: state.getIn(['bankOnboarding', 'startMain']),
    startVerifyMicroDeposit: state.getIn(['bankOnboarding', 'startVerifyMicroDeposit']),
    loading: state.getIn(['bankOnboarding', 'loading']),
    done_loading: state.getIn(['bankOnboarding', 'done_loading']),
    firebase_token: state.getIn(['createAccount', 'token']),
    dwollaCustomer: state.getIn(['bankOnboarding', 'dwollaCustomer']),
    // Tracks pagination
    currentPagex: state.getIn(['bankOnboarding', 'currentPagex']),

    /*Create Account State Variables*/
    newUser: state.getIn(['createAccount', 'newUser']),

    /*Validations*/
    cphoneValidations: state.getIn(['bankOnboarding', 'cphoneValidations']),
    cemailValidations: state.getIn(['bankOnboarding', 'cemailValidations']),
    cfirstNameValidations: state.getIn(['bankOnboarding', 'cfirstNameValidations']),
    clastNameValidations: state.getIn(['bankOnboarding', 'clastNameValidations']),
    addressValidations: state.getIn(['bankOnboarding', 'addressValidations']),
    zipValidations: state.getIn(['bankOnboarding', 'zipValidations']),
    cityValidations: state.getIn(['bankOnboarding', 'cityValidations']),
    ssnValidations: state.getIn(['bankOnboarding', 'ssnValidations']),
    basicInfoValidations: state.getIn(['bankOnboarding', 'basicInfoValidations']),

    /*Dwolla Customer Creation Status*/
    retry: state.getIn(['bankOnboarding', 'retry']),
    document: state.getIn(['bankOnboarding', 'document']),
    suspended: state.getIn(['bankOnboarding', 'suspended']),
    fullSSN: state.getIn(['bankOnboarding', 'fullSSN'])

  }),
  dispatch => ({
      listen(params) {

        console.log("Listening with params:", params);


        var endpoints = [
          {
            endpoint: 'appFlags/' + params.uid,
            eventType: 'value',
            listener: null,
            callback: (res) => {
              if(res != null){
                //console.log("onboarding_state: " + res.onboarding_state);
                if(res.micro_deposit_flow == true){
                  dispatch(dispatchFunctions.setVerifyMicroDeposit(true));
                }

                //load Retry screen
                if(res.customer_status == "retry"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.retry = true;
                  dispatch(dispatchFunctions.setRetry(true));
                }

                if(res.customer_status == "document"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.document = true;
                  dispatch(dispatchFunctions.setDocument(true));
                }

                if(res.customer_status == "suspended"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.suspended = true;
                  dispatch(dispatchFunctions.setSuspended(true));
                }

               if(res.onboarding_state == "complete"){
                 if (typeof params.toggleModal == 'function') params.toggleModal();
                 else Actions.MainViewContainer();
               }
              }
              //Note there is a predictable flow in the way in which events are
              //listed to/ For the time being appFlag events are the last events
              //that we need to listen to.
              dispatchList.doneListening = true;
            },
          },
          {
            endpoint: 'IAV/' + params.uid,
            eventType: 'value',
            listener: null,
            callback: (res) => {

              if(res != null){
                //console.log(JSON.parse(res));
                if(res.iav.body.token != ""){
                  if(!dispatchList.retry && !dispatchList.suspended && !dispatchList.document){
                    dispatch(dispatchFunctions.setIav(res.iav.body.token));
                  }
                  dispatchList.iav = true;
                }
              }
            },
          },
        ];

        // Reset dispatchList
        dispatchList.retry = false;
        dispatchList.suspended = false;
        dispatchList.document = false;

        for (var e in endpoints) {
          Firebase.listenTo(endpoints[e]);
          ACTIVE_LISTENERS.push(endpoints[e]);
        }
      },

      stopListening: () => {
        for (var e in ACTIVE_LISTENERS) {
          Firebase.stopListeningTo(ACTIVE_LISTENERS[e]);
        }
      },

      dispatchSetIav(input){
        dispatch(dispatchFunctions.setIav(input));
      },
      dispatchSetMain(input){
        dispatch(dispatchFunctions.setMain(input));
      },
      dispatchSetVerifyMicroDeposit(input){
        dispatch(dispatchFunctions.setVerifyMicroDeposit(input));
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
      dispatchSetLoading(input){
        dispatch(dispatchFunctions.setLoading(input));
      },
      dispatchSetDoneLoading(input){
        dispatch(dispatchFunctions.setDoneLoading(input));
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
      dispatchSetFullSSN(input){
        dispatch(dispatchFunctions.setFullSSN(input));
      },

      dispatchSetCPhoneValidations(input){
        dispatch(dispatchFunctions.setCPhoneValidations(input));
      },
      dispatchSetCEmailValidations(input){
        dispatch(dispatchFunctions.setCEmailValidations(input));
      },
      dispatchSetCFirstNameValidations(input){
        dispatch(dispatchFunctions.setCFirstNameValidations(input));
      },
      dispatchSetCLastNameValidations(input){
        dispatch(dispatchFunctions.setCLastNameValidations(input));
      },
      dispatchSetAddressValidations(input){
        dispatch(dispatchFunctions.setAddressValidations(input));
      },
      dispatchSetCityValidations(input){
        dispatch(dispatchFunctions.setCityValidations(input));
      },
      dispatchSetZipValidations(input){
        dispatch(dispatchFunctions.setZipValidations(input));
      },
      dispatchSetSSNValidations(input){
        dispatch(dispatchFunctions.setSSNValidations(input));
      },
      dispatchSetRetry(input){
        dispatch(dispatchFunctions.setRetry(input));
      },
      dispatchSetDocument(input){
        dispatch(dispatchFunctions.setDocument(input));
      },
      dispatchSetSuspended(input){
        dispatch(dispatchFunctions.setSuspended(input));
      },
      dispatchSetBasicInfoValidations(input){
        dispatch(dispatchFunctions.setBasicInfoValidations(input));
      },


      // Handles pagination
      dispatchSetPageX(index, direction, validations) {
        if(validations){
          dispatch(dispatchFunctions.setPageX(index));
        } else if (direction == "backward"){
          dispatch(dispatchFunctions.setPageX(index));
        }

      }
  })
)(BankOnboardingView);
/* END Connect function for TrackingScreen.js */
