// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Async from '../../helpers/Async';
import * as Headers from '../../helpers/Headers';

// Dispatch functions
import * as set from './PaymentsState';
import * as setMain from '../Main/MainState';

// Base view
import PaymentsView from './PaymentsView';

// Toggle console logs from this script
const enableLogs = true;

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    // currentUser: state.getIn(['main', 'currentUser']),
    header: state.getIn(['main', 'header']),

    // payments
    activeFirebaseListeners: state.getIn(['payments', 'activeFirebaseListeners']),
    incomingPayments: state.getIn(['payments', 'incomingPayments']),
    outgoingPayments: state.getIn(['payments', 'outgoingPayments']),
    globalPayments: state.getIn(['payments', 'globalPayments']),
    activeTab: state.getIn(['payments', 'activeTab']),
    activeFilter: state.getIn(['payments', 'activeFilter']),
    flags: state.getIn(['main', 'flags']),
    newUser: state.getIn(['createAccount', 'newUser']),
    startIav: state.getIn(['bankOnboarding', 'startIav'])

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {
    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        console.log("PAYMENTS VIEW CONTAINER RESPONSE: " + JSON.stringify(response));
        console.log("PAYMENTS VIEW CONTAINER RESPONSE: " + JSON.stringify(response.key));
        switch (response.key) {
          case "in":
            // Tack payment ID on as prop of each payment object
            for (var p in response.value) response.value[p].pid = p;

            if (response.value) dispatch(set.incomingPayments(response.value));
            else console.log("%cIncoming payments are null.", "color:red;font-weight:700;");
          break;

          case "out":
            // Tack payment ID on as prop of each payment object
            for (var p in response.value) response.value[p].pid = p;

            if (response.value) dispatch(set.outgoingPayments(response.value));
            else console.log("%cOutgoing payments are null.", "color:red;font-weight:700;");
          break;

          case "global":
            if (respnse.value) dispatch(set.globalPayments(response.value));
            else console.log("%Global payments are null.", "color:red;font-weight:700;");
          break;

        }
        switch(response.endpoint.split("/")[0]){
          case "appFlags":
            console.log("customerStatus: " + JSON.stringify(response.value.onboarding_state));
            //dispatch(set.flags(response.value));
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

    setNewUserToken: (token) => {
      dispatch(set.setNewUserToken(token));
    },

    setIav: (token) => {
      dispatch(set.setIav(token));
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
    // 2) Hit cancelPayment Lambda endpoint
    cancelPayment: (options) => {
      if (enableLogs) {
        console.log("%cCancelling payment " + options.pid, "color:red;font-weight:900;");
        console.log("%cCurrent data source:", "color:blue;font-weight:900;");
        console.log(options.ds._dataBlob.s1);
      }

      var ds = options.ds._dataBlob.s1;
      for (var p in ds) if (p == options.pid) delete ds[p];

      if (enableLogs) {
        console.log("%cNew data source:", "color:blue;font-weight:900;");
        console.log(ds);
      }

      if (options.flow == "out") dispatch(set.outgoingPayments(ds));
      else if (options.flow == "in") dispatch(set.incomingPayments(ds));

      Lambda.cancelPayment({type: options.type, payment_id: options.pid, token: options.token});
    },

    confirmPayment: (options) => {
      if (enableLogs) {
        console.log("%cConfirming payment " + options.pid, "color:green;font-weight:900;");
        console.log("%cCurrent data source:", "color:blue;font-weight:900;");
        console.log(options.ds._dataBlob.s1);
      }

      var ds = options.ds._dataBlob.s1;
      for (var p in ds) if (p == options.pid) {
        if (enableLogs) console.log("Row to edit: " + (ds[p]));
        ds[p].confirmed = true;
      };

      if (enableLogs) {
        console.log("%cNew data source:", "color:blue;font-weight:900;");
        console.log(ds);
      }

      dispatch(set.outgoingPayments(ds));
      Lambda.confirmPayment({payment_id: options.pid, token: options.token});
    },

    rejectPayment: (options) => {
      if (enableLogs) {
        console.log("%cRejecting payment " + options.pid, "color:red;font-weight:900;");
        console.log("%cCurrent data source:", "color:blue;font-weight:900;");
        console.log(options.ds._dataBlob.s1);
      }

      var ds = options.ds._dataBlob.s1;
      for (var p in ds) if (p == options.pid) {
        if (enableLogs) console.log("Row to edit: " + (ds[p]));
        delete ds[p];
      };

      if (enableLogs) {
        console.log("%cNew data source:", "color:blue;font-weight:900;");
        console.log(ds);
      }

      dispatch(set.outgoingPayments(ds));
      Lambda.rejectPayment({payment_id: options.pid, token: options.token});
    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( PaymentsView );
