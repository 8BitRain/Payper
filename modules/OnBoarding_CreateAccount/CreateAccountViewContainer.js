import {connect} from 'react-redux';
import {switchPage, setPage, setPasswordValidations} from './CreateAccountState'
import CreateAccountView from './CreateAccountView';

/**
  *   Connect function for CreateAccountView.js
**/
export default connect(
  state => ({
    firstName: state.getIn(['createAccount', 'currentUser', 'firstName']),
    lastName: state.getIn(['createAccount', 'currentUser', 'lastName']),
    email: state.getIn(['createAccount', 'currentUser', 'email']),
    password: state.getIn(['createAccount', 'currentUser', 'password']),
    phoneNumber: state.getIn(['createAccount', 'currentUser', 'phoneNumber']),
    currentPage: state.getIn(['createAccount', 'currentPage']),
    passwordValidations: state.getIn(['createAccount', 'passwordValidations'])
  }),
  dispatch => ({
    dispatchSetPage(index) {
      dispatch(setPage(index));
    },
    dispatchSetPasswordValidations(input) {
      dispatch(setPasswordValidations(input));
    }
  })
)(CreateAccountView);
/* END Connect function for CreateAccountView.js */
