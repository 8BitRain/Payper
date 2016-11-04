// Dependencies
import { connect } from 'react-redux';
import LandingScreenView from './LandingScreenView';
import * as dMain from '../Main/MainState';

function mapStateToProps(state) {
  return { currentUser: state.getIn(['main', 'currentUser']) };
}

function mapDispatchToProps(dispatch) {
  return { updateCurrentUser: (input) => dispatch(dMain.updateCurrentUser(input)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingScreenView);
