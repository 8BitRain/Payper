// Dependencies
import { connect } from 'react-redux';

// Dispatch functions
import * as set from './CreatePaymentState';

// Base view
import CreatePaymentView from './CreatePaymentView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),

    // payment
    amount: state.getIn(['payment', 'amount']),
    purpose: state.getIn(['payment', 'purpose']),
    payments: state.getIn(['payment', 'payments']),
    recip_id: state.getIn(['payment', 'recip_id']),
    recip_name: state.getIn(['payment', 'recip_name']),
    recip_pic: state.getIn(['payment', 'recip_pic']),
    sender_id: state.getIn(['payment', 'sender_id']),
    sender_name: state.getIn(['payment', 'sender_name']),
    sender_pic: state.getIn(['payment', 'sender_pic']),
    type: state.getIn(['payment', 'type']),
    token: state.getIn(['payment', 'token']),
    confirmed: state.getIn(['payment', 'confirmed']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    setAmount: (input) => dispatch(set.amount(input)),
    setPurpose: (input) => dispatch(set.purpose(input)),
    setPayments: (input) => dispatch(set.payments(input)),
    setRecipID: (input) => dispatch(set.recipID(input)),
    setRecipName: (input) => dispatch(set.recipName(input)),
    setRecipPic: (input) => dispatch(set.recipPic(input)),
    setSenderID: (input) => dispatch(set.senderID(input)),
    setSenderName: (input) => dispatch(set.senderName(input)),
    setSenderPic: (input) => dispatch(set.senderPic(input)),
    setType: (input) => dispatch(set.type(input)),
    setToken: (input) => dispatch(set.token(input)),
    setConfirmed: (input) => dispatch(set.confirmed(input)),

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( CreatePaymentView );
