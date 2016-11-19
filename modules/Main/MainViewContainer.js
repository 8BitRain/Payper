// Dependencies
import { connect } from 'react-redux';
import * as d from './MainState';
import NewMainView from './NewMainView';

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(d.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(d.updateCurrentUser(input))
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( NewMainView );
