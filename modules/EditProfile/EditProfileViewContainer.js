// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as setMain from '../EditProfile/EditProfileState';

// Base view
import NotificationsView from './NotificationsView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect( mapStateToProps, mapDispatchToProps )( NotificationsView );
