import {connect} from 'react-redux';
import {switchPage, setPage, setEmailValidations, setPasswordValidations, setFirstNameValidations, setLastNameValidations, setPhoneNumberValidations} from './CreateAccountState'
import CreateAccountView from './CreateAccountView';

/**
  *   Connect function for CreateAccountView.js
**/
export default connect(
  state => ({
    // Account setup variables
    firstName: state.getIn(['createAccount', 'currentUser', 'firstName']),
    lastName: state.getIn(['createAccount', 'currentUser', 'lastName']),
    email: state.getIn(['createAccount', 'currentUser', 'email']),
    password: state.getIn(['createAccount', 'currentUser', 'password']),
    phoneNumber: state.getIn(['createAccount', 'currentUser', 'phoneNumber']),

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
    dispatchSetPage(index) {
      dispatch(setPage(index));
    },

    // Updates validation booleans
    dispatchSetPasswordValidations(input) {
      dispatch(setPasswordValidations(input));
    },
    dispatchSetEmailValidations(input) {
      dispatch(setEmailValidations(input));
    },
    dispatchSetFirstNameValidations(input) {
      dispatch(setFirstNameValidations(input));
    },
    dispatchSetLastNameValidations(input) {
      dispatch(setLastNameValidations(input));
    },
    dispatchSetPhoneNumberValidations(input) {
      dispatch(setPhoneNumberValidations(input));
    }
  })
)(CreateAccountView);
/* END Connect function for CreateAccountView.js */
