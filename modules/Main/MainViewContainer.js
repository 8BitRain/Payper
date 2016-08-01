import {connect} from 'react-redux';
import * as dispatchFunctions from  './MainState';
import MainView from './MainView';

/**
  *   Connect function for MainView.js
**/
export default connect(
  state => ({
    //token: state.getIn(['main', 'token']),
  }),
  dispatch => ({
    /*dispatchSetToken(input){
      dispatch(dispatchFunctions.setToken(input));
    }*/
  })
)(MainView);
/* END Connect function for MainView.js */
