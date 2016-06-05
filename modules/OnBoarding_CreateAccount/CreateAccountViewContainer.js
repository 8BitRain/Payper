
import {connect} from 'react-redux';
import CreateAccountView from './CreateAccountView';

export default connect(
  state => ({
    firstName: state.getIn(['createAccount', 'currentUser', 'firstName']),
    lastName: state.getIn(['createAccount', 'currentUser', 'lastName']),
    email: state.getIn(['createAccount', 'currentUser', 'email']),
    password: state.getIn(['createAccount', 'currentUser', 'password']),
    phoneNumber: state.getIn(['createAccount', 'currentUser', 'phoneNumber']),
    currentPage: state.getIn(['createAccount', 'currentPage'])

  })
)(CreateAccountView);
