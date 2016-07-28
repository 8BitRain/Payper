import { connect } from 'react-redux';
import FirebaseBindingView from './FirebaseBindingView';
import * as Firebase from '../../services/Firebase';
import * as d from './FirebaseBindingState';

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
  return {
    activeFirebaseListeners: state.getIn(['firebaseBinding', 'activeFirebaseListeners']),
    valueOne: state.getIn(['firebaseBinding', 'valueOne']),
    valueTwo: state.getIn(['firebaseBinding', 'valueTwo'])
  }
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
  return {
    listen: (listeners) => {
      Firebase.listenTo(listeners, (response) => {
        switch (response.name) {
          case "TestValueOne":
            dispatch(d.setValueOne(response.value));
          break;
          case "TestValueTwo":
            dispatch(d.setValueTwo(response.value));
          break;
        }
      });

      dispatch(d.setactiveFirebaseListeners(listeners));
    },
    stopListening: (listeners) => {
      Firebase.stopListeningTo(listeners);
      dispatch(d.setactiveFirebaseListeners([]));
    },
    setTest: (input) => dispatch(d.setTest(input))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirebaseBindingView);
