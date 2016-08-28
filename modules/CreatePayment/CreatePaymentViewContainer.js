// Dependencies
import { connect } from 'react-redux';

// Helpers
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Lambda from '../../services/Lambda';

// Dispatch functions
import * as set from './CreatePaymentState';
import * as setMain from '../Main/MainState';
import * as setUserSearch from '../UserSearch/UserSearchState';
import * as setPayments from '../Payments/PaymentsState';

// Base view
import CreatePaymentView from './CreatePaymentView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),

    // userSearch
    selectedContact: state.getIn(['userSearch', 'selectedContact']),

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

    paymentInfo: {
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
      invite: state.getIn(['payment', 'invite']),
      info: state.getIn(['payment', 'info']),
    },

    payment: state.getIn(['payment', 'info']),

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

    createPayment: (info) => {
      console.log("%cCreating payment:", "color:orange;font-weight:900;");
      console.log(info);
    },

    createRequest: (info) => {
      console.log("%cCreating request:", "color:orange;font-weight:900;");
      console.log(info);
    },

    setAll: (input) => {
      dispatch(set.all(input));
    },

    setPaymentInfo: (options, callback) => {

      var recip,
          sender,
          payment = {
            amount: options.payment.amount,
            purpose: options.payment.purpose,
            paymentsMade: 0,
            payments: options.payment.payments,
            recip_id: null,
            recip_name: null,
            recip_pic: null,
            sender_id: null,
            sender_name: null,
            sender_pic: null,
            type: options.type,
            token: options.currentUser.token,
            confirmed: false,
            invite: null,
            invitee: null,
            phoneNumber: null,
          };

      // Determine flow of money
      if (options.type == "payment") {
        payment.confirmed = true;
        recip = options.otherUser;
        sender = options.currentUser;
      } else {
        recip = options.currentUser;
        sender = options.otherUser;
      }

      // Is this an invite?
      if (payment.type == "payment" && !recip.username || payment.type == "request" && !sender.username) {
        payment.invite = true;
        payment.invitee = (payment.type == "payment") ? "recip" : "sender";
        payment.phoneNumber = options.otherUser.phone;
        payment.type = "invite";
      } else {
        payment.invite = false;
      }

      // Recipient info
      payment.recip_name = recip.first_name + " " + recip.last_name;
      payment.recip_id = recip.uid;
      payment.recip_pic = recip.profile_pic;

      // Sender info
      payment.sender_name = sender.first_name + " " + sender.last_name;
      payment.sender_id = sender.uid;
      payment.sender_pic = sender.profile_pic;

      // console.log("%cPayment:", "color:blue;font-weight:900;");
      // console.log(payment);

      dispatch(set.info(payment));
    },

    sendPayment: (payment, callback) => {
      console.log("Payment in sendPayment():", payment);
      if (payment.invite) {
        Lambda.inviteViaPayment(payment, (success) => {
          if (typeof callback == "function") callback(success);
          else console.log("%cCallback is not a function.", "color:red;font-weight;");
        });
      } else {
        Lambda.createPayment(payment, (success) => {
          if (typeof callback == "function") callback(success);
          else console.log("%cCallback is not a function.", "color:red;font-weight;");
        });
      }
    },

    reset: () => {
      dispatch(setUserSearch.selectedContact({ username: "", first_name: "", last_name: "", profile_pic: "", type: "" }));
      dispatch(set.info({}));
      dispatch(set.amount(""));
      dispatch(set.purpose(""));
      dispatch(set.payments(""));
      dispatch(set.recipID(""));
      dispatch(set.recipName(""));
      dispatch(set.recipPic(""));
      dispatch(set.senderID(""));
      dispatch(set.senderName(""));
      dispatch(set.senderPic(""));
      dispatch(set.type(""));
      dispatch(set.token(""));
      dispatch(set.confirmed(""));
      dispatch(set.invite(""));
      dispatch(set.phoneNumber(""));
    },

    setActiveFilter: (options) => {
      dispatch(setPayments.activeFilter(options));
    },

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( CreatePaymentView );
