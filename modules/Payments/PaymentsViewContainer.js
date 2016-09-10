// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';
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
    startIav: state.getIn(['bankOnboarding', 'startIav']),
    suspended: state.getIn(['bankOnboarding', 'suspended']),
    retry: state.getIn(['bankOnboarding', 'retry']),
    document: state.getIn(['bankOnboarding', 'document'])

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {
    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        switch (response.key) {

          case "out":
            // Tack payment ID on as prop of each payment object
            for (var p in response.value) response.value[p].pid = p;

            // Convert from JSON to array and extract PID's of complete payments
            var paymentArray = SetMaster5000.JSONToArray({ JSON: response.value }),
                paymentsToPrioritize = SetMaster5000.extractCompletedPayments({ payments: paymentArray });

            // Move complete payments to the front of array
            var orderedPayments = (paymentsToPrioritize.length == 0) ? paymentArray : SetMaster5000.prioritizePayments({ payments: paymentArray, prioritize: paymentsToPrioritize });

            // Persist payments to Redux store
            if (response.value) dispatch(set.outgoingPayments(orderedPayments));
            else console.log("%cIncoming payments are null.", "color:red;font-weight:700;");
          break;

          case "in":
            // Tack payment ID on as prop of each payment object
            for (var p in response.value) response.value[p].pid = p;

            // Convert from JSON to array and extract PID's of complete payments
            var paymentArray = SetMaster5000.JSONToArray({ JSON: response.value }),
                paymentsToPrioritize = SetMaster5000.extractCompletedPayments({ payments: paymentArray });

            // Move complete payments to the front of array
            var orderedPayments = (paymentsToPrioritize.length == 0) ? paymentArray : SetMaster5000.prioritizePayments({ payments: paymentArray, prioritize: paymentsToPrioritize });

            // Persist payments to Redux store
            if (response.value) dispatch(set.incomingPayments(orderedPayments));
            else console.log("%cIncoming payments are null.", "color:red;font-weight:700;");
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

    setNewUserToken: (token) => {
      dispatch(set.setNewUserToken(token));
    },

    setIav: (token) => {
      dispatch(set.setIav(token));
    },
    setSuspended: (token) => {
      dispatch(set.setSuspended(token));
    },
    setRetry: (token) => {
      dispatch(set.setRetry(token));
    },
    setDocument: (token) => {
      dispatch(set.setDocument(token));
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

    setActiveFilter: (filter) => {
      console.log("Setting active filter to", filter);
      dispatch(set.activeFilter(filter));
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

      Lambda.cancelPayment({ invite: options.invite, type: options.type, payment_id: options.pid, token: options.token });
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
      Lambda.confirmPayment({ type: options.type, payment_id: options.pid, token: options.token});
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
