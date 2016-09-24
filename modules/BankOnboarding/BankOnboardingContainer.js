import {connect} from 'react-redux';
import * as dispatchFunctions from  './BankOnboardingState';
import BankOnboardingView from './BankOnboardingView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';
import {Actions} from 'react-native-router-flux';

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
      listen(endpoints) {

        Firebase.listenTo(endpoints, (response) => {
          console.log("%cFirebase listener received:", "color:orange;font-weight:900;");
          console.log(response);
          console.log("Response Value: " + JSON.stringify(response.value));


          var fundingSourceAdded = false;
          //Go From (Bank Onboarding Container)SSN submit page to IAV
          console.log("Endpoint: " + JSON.stringify(endpoints));
          console.log("Response Endpoint: " + JSON.stringify(response.endpoint));


          switch(response.endpoint.split("/")[0]){
            //Next try removing IAV case
            case "appFlags":
              if(response.value != null){
                //console.log("onboarding_state: " + response.value.onboarding_state);
                if(response.value.micro_deposit_flow == true){
                  console.log("Microdeposits flow is true");
                  dispatch(dispatchFunctions.setVerifyMicroDeposit(true));
                  break;
                }

                //load Retry screen
                if(response.value.customer_status == "retry"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.retry = true;
                  dispatch(dispatchFunctions.setRetry(true));
                  console.log("Loading Retry scenario");
                  break;
                }

                if(response.value.customer_status == "document"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.document = true;
                  dispatch(dispatchFunctions.setDocument(true));
                  console.log("Loading Document scenario");
                  break;
                }

                if(response.value.customer_status == "suspended"){
                  /*TODO Make sure you update SSN to reset retry to false before
                  submitting data so you don't get stuck in a loop!*/
                  dispatchList.suspended = true;
                  dispatch(dispatchFunctions.setSuspended(true));

                  console.log("Loading Suspended scenario");
                  break;
                }

               if(response.value.onboarding_state == "complete"){
                console.log("Move to app");
                //priorityDispatch = "main"
                Actions.MainViewContainer();
                break;
               }
              }
              //Note there is a predictable flow in the way in which events are
              //listed to/ For the time being appFlag events are the last events
              //that we need to listen to.
              dispatchList.doneListening = true;
              break;
            case "IAV":
              if(response.value != null){
                if(response.value.iav != ""){
                  console.log("Starts IAV");

                  if(!dispatchList.retry && !dispatchList.suspended && !dispatchList.document){
                    dispatch(dispatchFunctions.setIav(response.value.iav));
                  }

                  //priorityDispatch = "iav"
                  dispatchList.iav = true;

                }
              }
              break;
          }
          /*Handle Dispatch Priorities that cause re-rendering in app*/
          /*Retry IAV takes priority. It is possible iav will never be hit
           if a user's customer is not sucessfully created*/
          /*console.log(dispatchList);
          if(dispatchList.doneListening){
            if(dispatchList.iav == true && dispatchList.retry == true){


              dispatch(dispatchFunctions.setRetry(true));
            }
            if(dispatchList.iav == false && dispatchList.retry == true){
              dispatch(dispatchFunctions.setRetry(true));
            }
            if(dispatchList.iav == true && dispatchList.retry == false){
              dispatch(dispatchFunctions.setIav(response.value.iav));
            }
          }*/

        });
          console.log("DispatchList" + JSON.stringify(dispatchList));
          //reset dispatchList
          dispatchList.retry = false;
          dispatchList.suspended = false;
          dispatchList.document = false;

          dispatch(dispatchFunctions.activeFirebaseListeners(endpoints));
        },

      stopListening(endpoints) {
        Firebase.stopListeningTo(endpoints);
        dispatch(dispatchFunctions.activeFirebaseListeners([]));
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
