// Dependencies
import { connect } from 'react-redux';
import SplashView from './SplashView';
import setInMain from '../Main/MainState';

function mapStateToProps(state) {
  return { currentUser: state.getIn(['main', 'currentUser']) }
};

export default connect(mapStateToProps)(SplashView);
