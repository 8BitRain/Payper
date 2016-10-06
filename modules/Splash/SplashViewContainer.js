// Dependencies
import { connect } from 'react-redux';
import SplashView from './SplashView';
import setInMain from '../Main/MainState';

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
};

function mapDispatchToProps(dispatch) {
  return {}
};

export default connect( mapStateToProps, mapDispatchToProps )( SplashView );
