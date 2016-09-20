// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as setMain from '../Main/MainState';

// Base view
import ProfileView from './ProfileView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),
    
  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    setCurrentUser: (user) => {
      dispatch(setMain.user(user));
    },

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( ProfileView );
