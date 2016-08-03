// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Async from '../../helpers/Async';
import * as Headers from '../../helpers/Headers';

// Dispatch functions
import * as set from './PaymentsState';
import * as setMain from '../Main/MainState';

// Base view
import PaymentsView from './PaymentsView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    currentUser: state.getIn(['main', 'currentUser']),
    header: state.getIn(['main', 'header']),

    // payments
    activeFirebaseListeners: state.getIn(['payments', 'activeFirebaseListeners']),
    incomingPayments: state.getIn(['payments', 'incomingPayments']),
    outgoingPayments: state.getIn(['payments', 'outgoingPayments']),
    globalPayments: state.getIn(['payments', 'globalPayments']),
    activeTab: state.getIn(['payments', 'activeTab']),
    activeFilter: state.getIn(['payments', 'activeFilter']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {
    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        switch (response.key) {

          case "in":
            if (response.value) dispatch(set.incomingPayments(response.value));
            else console.log("%cIncoming payments are null.", "color:red;font-weight:700;");
          break;

          case "out":
            if (response.value) dispatch(set.outgoingPayments(response.value));
            else console.log("%cOutgoing payments are null.", "color:red;font-weight:700;");
          break;

          case "global":
            if (respnse.value) dispatch(set.globalPayments(response.value));
            else console.log("%Global payments are null.", "color:red;font-weight:700;");
          break;

        }
      });
      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {
      Firebase.stopListeningTo(endpoints);
      dispatch(set.activeFirebaseListeners([]));
    },

    setIsEmpty: (isEmpty) => {
      dispatch(set.isEmpty(isEmpty));
    },

    setActiveTab: (tab) => {
      // Set header
      if (tab == "tracking") {
        dispatch(setMain.header(Headers.trackingHeader({
          callbackIn: () => dispatch(set.activeFilter("incoming")),
          callbackOut: () => dispatch(set.activeFilter("outgoing")),
        })));
      } else if (tab == "global") {
        dispatch(setMain.header(Headers.globalHeader()));
      }

      // Set content
      dispatch(set.activeTab(tab));
    },

    // 1) Remove payment from DataSource
    // 2) Remove payment from DB via Lambda endpoint
    cancelPayment: (pid) => {
      console.log("Cancelling payment", pid);
    },

    confirmPayment: (pid) => {
      console.log("Confirming payment", pid);
    },

    rejectPayment: (pid) => {
      console.log("Rejecting payment", pid);
    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( PaymentsView );
