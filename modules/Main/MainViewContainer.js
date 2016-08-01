// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Async from '../../helpers/Async';

// Dispatch functions
import * as set from './MainState';

// Base view
import MainView from './MainView';
import MainViewV2 from './MainViewV2';

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

      // Set currentUser and loggedIn
      Async.get('user', (user) => {
        if (user == "") {
          dispatch(set.signedIn(false));

          if (typeof callback == 'function') callback(false);
          else console.log("Callback is not a function.");
        } else {
          dispatch(set.currentUser(JSON.parse(user)));
          dispatch(set.signedIn(true));

          if (typeof callback == 'function') callback(true);
          else console.log("Callback is not a function.");
        }
      });

    },

    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        console.log("Firebase response key:", response.key);
        switch (response.endpoint.split("/")[0]) {

          // Set number of unseen notifications and notificationList
          case "notifications":
            console.log("Got notifications:", response.value);
            var notifications = response.value,
                numUnseen = 0;
            // Count number of unseen notifications
            for (var n in notifications) {
              if (!notifications[n].seen) numUnseen++;
            }
            dispatch(set.numUnseenNotifications(numUnseen));
            dispatch(set.notifications(notifications));
          break;

          // Set user's app flags
          case "appFlags":
            console.log("Got appFlags:", response.value);
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
      dispatch(set.currentPage(page));
    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( MainViewV2 );
