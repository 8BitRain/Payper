import {connect} from 'react-redux';
import * as dispatchFunctions from  './CreatePaymentState';
import CreatePaymentView from './CreatePaymentView';

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
    completedPayments: state.getIn(['payment', 'completedPayments'])

  }),
  dispatch => ({

    // Creates data
    dispatchCreatePayment(data) {
      console.log("=-=-=  REACHED dispatchCreatePayment(data)  =-=-=")
    }

  })
)(CreatePaymentView);
/* END Connect function for CreateAccountView.js */
