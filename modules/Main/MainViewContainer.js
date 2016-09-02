// Dependencies
import { connect } from 'react-redux';
import { ListView, DataSource } from 'react-native';
var Contacts = require('react-native-contacts');

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';
import * as Async from '../../helpers/Async';
import * as Headers from '../../helpers/Headers';

// Clone for state updates
const EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// Dispatch functions
import * as set from './MainState';
import * as setPayments from '../Payments/PaymentsState';

// Base view
import MainView from './MainView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    activeFirebaseListeners: state.getIn(['main', 'activeFirebaseListeners']),
    signedIn: state.getIn(['main', 'signedIn']),
    currentUser: state.getIn(['main', 'currentUser']),
    currentPage: state.getIn(['main', 'currentPage']),
    flags: state.getIn(['main', 'flags']),
    notifications: state.getIn(['main', 'notifications']),
    numUnseenNotifications: state.getIn(['main', 'numUnseenNotifications']),
    header: state.getIn(['main', 'header']),
    sideMenuIsOpen: state.getIn(['main', 'sideMenuIsOpen']),
    initialized: state.getIn(['main', 'initialized']),

    // payments
    activeFilter: state.getIn(['payments', 'activeFilter']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    /**
      *   1) Set signed in user's user object
      *   2) Set session token
      *   3) Set signedIn to true
    **/
    initialize: (callback) => {

      Async.get('user', (user) => {
        if (!user) {

          // Sign in failed
          console.log("=-=-=-=-= Sign in failed =-=-=-=-=");

          dispatch(set.signedIn(false));
          if (typeof callback == 'function') callback(false);
          else console.log("Callback is not a function.");

        } else {

          var parsedUser = JSON.parse(user);

          // Sign in succeeded
          dispatch(set.currentUser(parsedUser));
          dispatch(set.signedIn(true));
          dispatch(set.initialized(true));

          // Get decrypted phone number and email address
          Lambda.getDecryptedUser({ token: parsedUser.token, uid: parsedUser.uid }, (res) => {
            console.log("getDecryptedUser callback response:\n", res);

            parsedUser.decryptedPhone = res.phone;
            parsedUser.decryptedEmail = res.email;

            dispatch(set.currentUser(parsedUser));
          });

          // Get user's native phone contacts
          Contacts.getAll((err, contacts) => {
            if (err && err.type === 'permissionDenied') {
              console.error("%cError getting contacts:", "color:red;font-weight:900;");
              console.error(err);
            } else {
              console.log("%cSuccessfully got native contacts:", "color:green;font-weight:900;");
              console.log(contacts);
              // Format contacts then log them to AsyncStorage
              var c = SetMaster5000.formatNativeContacts(contacts);
              dispatch(set.nativeContacts(c));
              Async.set('native_contacts', JSON.stringify(c));
            }
          });

          // Get decrypted phoneNumber:uid list


          if (typeof callback == 'function') callback(true);
          else console.log("Callback is not a function.");
        }
      });

    },

    listen: (endpoints, callback) => {

      console.log("\n\n\n\n\n\n\n\n\n\nGonna listen to:", endpoints);

      Firebase.listenTo(endpoints, (response) => {
        console.log("FIREBASE RESPONSE:\n\n", response);
        switch (response.endpoint.split("/")[0]) {

          case "notifications":
            var notifications = response.value,
                numUnseen = 0;
            // Count number of unseen notifications
            for (var n in notifications) {
              if (!notifications[n].seen) numUnseen++;
            }
            dispatch(set.numUnseenNotifications(numUnseen));
            dispatch(set.notifications(notifications));

            if (typeof callback == 'function') callback();
            else console.log("%cCallback is not a function.", "color:red;font-weight:900;");
          break;

          case "appFlags":
            console.log("Got app flags");
            console.log(response);
            dispatch(set.flags(response.value));
          break;

        }
      });
      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {
      Firebase.stopListeningTo(endpoints);
      dispatch(set.activeFirebaseListeners([]));
    },

    reset: () => {

      // Reset main store
      dispatch(set.activeFirebaseListeners([]));
      dispatch(set.signedIn(false));
      dispatch(set.currentUser({}));
      dispatch(set.flags(""));
      dispatch(set.notifications([]));
      dispatch(set.numUnseenNotifications(0));
      dispatch(set.header({
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": false,
          "closeIcon": false,
          "flowTabs": false,
        },
        index: null,
        numCircles: null,
        title: null,
        callbackIn: null,
        callbackOut: null,
      }));
      dispatch(set.sideMenuIsOpen(false));
      dispatch(set.currentPage("payments"));
      dispatch(set.nativeContacts([]));
      dispatch(set.initialized(false));

      // Reset payments store
      dispatch(setPayments.activeFirebaseListeners([]));
      dispatch(setPayments.incomingPayments([]));
      dispatch(setPayments.outgoingPayments([]));
      dispatch(setPayments.globalPayments([]));
      dispatch(setPayments.isEmpty(true));
      dispatch(setPayments.activeTab("tracking"));
      dispatch(setPayments.activeFilter("incoming"));

    },

    inviteDirect: (options, callback) => {
      Lambda.inviteDirect(options, (success) => {
        callback(success);
      });
    },

    setHeader: (options) => {
      dispatch(set.header(options));
    },

    setSideMenuIsOpen: (isOpen) => {
      dispatch(set.sideMenuIsOpen(isOpen));
    },

    setCurrentPage: (page) => {
      if (page == "notifications") dispatch(set.header(Headers.notificationsHeader()));
      else if (page == "fundingSources") dispatch(set.header(Headers.fundingSourcesHeader()));
      else if (page == "profile") dispatch(set.header(Headers.profileHeader()));
      dispatch(set.currentPage(page));
    },

    setCurrentUser: (user) => {
      dispatch(set.currentUser(user));
    },

  }
}

export default connect( mapStateToProps, mapDispatchToProps )( MainView );
