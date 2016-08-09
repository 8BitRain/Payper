// Dependencies
import { connect } from 'react-redux';

// Helpers
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Lambda from '../../services/Lambda';

// Dispatch functions
import * as set from './CreatePaymentState';

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

      console.log("options.currentUser:\n" + JSON.stringify(options.currentUser));
      console.log("options.otherUser:\n" + JSON.stringify(options.otherUser));

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
      if (options.type == "pay") {
        payment.confirmed = true;
        recip = options.otherUser;
        sender = options.currentUser;
      } else {
        recip = options.currentUser;
        sender = options.otherUser;
      }

      // Is this an invite?
      if (options.type == "pay" && !recip.username || options.type == "request" && !sender.username) {
        payment.invite = true;
        payment.invitee = (payment.type == "pay") ? "recip" : "sender";
        payment.phoneNumber = StringMaster5000.formatPhoneNumber(options.otherUser.phone);
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

      dispatch(set.info(payment));
    },

    sendPayment: (payment, callback) => {
      if (payment.invite) {
        Lambda.inviteViaPayment(payment, (success) => {
          console.log("Reached inviteViaPayment callback...");
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

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( CreatePaymentView );
