// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as setMain from '../Main/MainState';

// Base view
import SettingsView from './SettingsView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),
    numUnseenNotifications: state.getIn(['main', 'numUnseenNotifications']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect( mapStateToProps, mapDispatchToProps )( SettingsView );
