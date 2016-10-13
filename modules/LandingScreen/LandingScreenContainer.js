// Dependencies
import { connect } from 'react-redux';
import LandingScreenView from './LandingScreenView';
import * as setInMain from '../Main/MainState';

function mapStateToProps(state) {
  return { currentUser: state.getIn(['main', 'currentUser']) };
}

export default connect(mapStateToProps)(LandingScreenView);
