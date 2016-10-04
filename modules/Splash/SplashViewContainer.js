// Dependencies
import { connect } from 'react-redux';
import SplashView from './SplashView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
};

function mapDispatchToProps(dispatch) {
  return {}
};

export default connect( mapStateToProps, mapDispatchToProps )( SplashView );
