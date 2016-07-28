import {connect} from 'react-redux';
import FirebaseBindingView from './FirebaseBindingView';
import * as Firebase from '../../services/Firebase';
import * as d from './FirebaseBindingState';

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
  return {
    test: state.getIn(['firebaseBinding', 'test'])
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    setTest: (input) => dispatch(d.setTest(input)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirebaseBindingView);
