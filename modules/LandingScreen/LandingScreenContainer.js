// Dependencies
import { connect } from 'react-redux';
import LandingScreenView from './LandingScreenView';
import * as setInMain from '../Main/MainState';

export default connect(
  state => ({ currentUser: state.getIn(['main', 'currentUser']) }),
  dispatch => ({ setUser(user) { dispatch(setInMain.user(user)); } })
)(LandingScreenView);
