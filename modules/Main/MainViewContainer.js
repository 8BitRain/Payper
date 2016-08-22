// Dependencies
import { connect } from 'react-redux';
var Contacts = require('react-native-contacts');

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Async from '../../helpers/Async';
import * as Headers from '../../helpers/Headers';

// Dispatch functions
import * as set from './MainState';

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

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    /**
      *   1) Set logged in user's user object
      *   2) Set session token
      *   3) Set loggedIn to true
    **/
    initialize: (callback) => {

      Async.get('user', (user) => {
        if (user == "") {

          // Sign in failed
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
              var c = StringMaster5000.formatNativeContacts(contacts);
              dispatch(set.nativeContacts(c));
              Async.set('native_contacts', JSON.stringify(c));
            }
          });

          if (typeof callback == 'function') callback(true);
          else console.log("Callback is not a function.");
        }
      });

    },

    listen: (endpoints, callback) => {
      Firebase.listenTo(endpoints, (response) => {
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
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( MainView );
