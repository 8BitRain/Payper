import {connect} from 'react-redux';
import * as dispatchFunctions from  './CreatePaymentState';
import CreatePaymentView from './CreatePaymentView';
import * as Firebase from '../../services/Firebase';

/**
  *   Connect function for CreateAccountView.js
**/
export default connect(
  state => ({

    // Payment setup variables
    to: state.getIn(['payment', 'to']),
    from: state.getIn(['payment', 'from']),
    memo: state.getIn(['payment', 'memo']),
    frequency: state.getIn(['payment', 'frequency']),
    totalCost: state.getIn(['payment', 'totalCost']),
    singleCost: state.getIn(['payment', 'singleCost']),
    totalPayments: state.getIn(['payment', 'totalPayments']),
    completedPayments: state.getIn(['payment', 'completedPayments']),

    // Signed in user
    user: state.get('user'),

  }),
  dispatch => ({

    // Creates data
    dispatchCreatePayment(data) {
      console.log("=-=-=  REACHED dispatchCreatePayment(data)  =-=-=")

      var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create";
      fetch(url, {method: "POST", body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("POST response");
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        console.log(responseData);
      })
      .done();

    },

    // Fetches users from FB
    getUsers() {
      return Firebase.getUsers();
    }


  })
)(CreatePaymentView);
/* END Connect function for CreateAccountView.js */
