// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Dispatch functions
import * as set from './MainState';

// Base view
import PredictiveSearchView from './MainView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // main
    activeFirebaseListeners: state.getIn(['main', 'activeFirebaseListeners']),
    signedIn: state.getIn(['main', 'signedIn']),
    currentUser: state.getIn(['main', 'currentUser']),
    flags: state.getIn(['main', 'flags']),

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
    initialize: (options) => {
      dispatch(set.currentUser(options.user))
      .then(() => {
        dispatch(set.loggedIn(true));
      });
    },

    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        switch (response.key.split("/")[0]) {

          // Set number of unseen notifications and notificationList
          case "notifications":
            console.log("Got notifications:", resoonse.value);
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
            console.log("Got appFlags:", resoonse.value);
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
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( MainView, MainViewV2 );
