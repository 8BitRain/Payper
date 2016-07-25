import {connect} from 'react-redux';
import * as dispatchFunctions from  './CreateAccountState';
import CreateAccountView from './CreateAccountView';
import Validators from '../../helpers/validators';
import * as Firebase from '../../services/Firebase';
import * as Init from '../../_init';

/**
  *   Connect function for CreateAccountView.js
**/
export default connect(
  state => ({
    // Account setup variables
    firstName: state.getIn(['createAccount', 'currentUser']).firstName,
    lastName: state.getIn(['createAccount', 'currentUser']).lastName,
    email: state.getIn(['createAccount', 'currentUser']).email,
    password: state.getIn(['createAccount', 'currentUser']).password,
    phoneNumber: state.getIn(['createAccount', 'currentUser']).phoneNumber,
    currentUser: state.getIn(['createAccount', 'currentUser']),

    // Tracks pagination
    currentPage: state.getIn(['createAccount', 'currentPage']),

    // Input validation booleans
    emailValidations: state.getIn(['createAccount', 'emailValidations']),
    passwordValidations: state.getIn(['createAccount', 'passwordValidations']),
    firstNameValidations: state.getIn(['createAccount', 'firstNameValidations']),
    lastNameValidations: state.getIn(['createAccount', 'lastNameValidations']),
    phoneNumberValidations: state.getIn(['createAccount', 'phoneNumberValidations'])
  }),
  dispatch => ({
    // Handles pagination
    dispatchSetPage(index, direction, validations, input) {
      if (direction == "forward") {
        var currentPage = index - 1;
        // console.log("input: " + input);
        // console.log("index: " + index);
        // console.log("direction: " + direction);
        // console.log("validations: " + JSON.stringify(validations));
        if (validations.valid) {
          switch (currentPage) {
            // Email
            case 0:
              dispatch(dispatchFunctions.setEmail(input));
              break;
            // Password
            case 1:
              dispatch(dispatchFunctions.setPassword(input));
              break;
            // First name
            case 2:
              dispatch(dispatchFunctions.setFirstName(input));
              break;
            // Last name
            case 3:
              dispatch(dispatchFunctions.setLastName(input));
              break;
            // Phone number
            case 4:
              dispatch(dispatchFunctions.setPhoneNumber(input));
              break;
          }
          dispatch(dispatchFunctions.setPage(index));
        }
      } else {
        dispatch(dispatchFunctions.setPage(index));
      }
    },

    // Updates validation booleans
    dispatchSetPasswordValidations(input) {
      dispatch(dispatchFunctions.setPasswordValidations(input));
    },
    dispatchSetEmailValidations(input) {
      dispatch(dispatchFunctions.setEmailValidations(input));
    },
    dispatchSetFirstNameValidations(input) {
      dispatch(dispatchFunctions.setFirstNameValidations(input));
    },
    dispatchSetLastNameValidations(input) {
      dispatch(dispatchFunctions.setLastNameValidations(input));
    },
    dispatchSetPhoneNumberValidations(input) {
      dispatch(dispatchFunctions.setPhoneNumberValidations(input));
    },
    dispatchCreateAccount(user) {
      // Create account
      Init.createUser(user);
    }
  })
)(CreateAccountView);
/* END Connect function for CreateAccountView.js */
