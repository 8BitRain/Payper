// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Dispatch functions
import * as set from './UserSearchState';

// Base view
import UserSearchView from './UserSearchView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // userSearch
    activeFirebaseListeners: state.getIn(['userSearch', 'activeFirebaseListeners']),
    allContacts: state.getIn(['userSearch', 'allContacts']),
    filteredContacts: state.getIn(['userSearch', 'filteredContacts']),
    selectedContact: state.getIn(['userSearch', 'selectedContact']),
    empty: state.getIn(['userSearch', 'empty']),

    // main
    currentUser: state.getIn(['main', 'currentUser']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {
    listen: (endpoints) => {
      Firebase.listenTo(endpoints, (response) => {
        response.value = StringMaster5000.formatContacts(response.value);
        dispatch(set.allContacts(response.value));
      });

      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {
      Firebase.stopListeningTo(endpoints);
      dispatch(set.activeFirebaseListeners([]));
    },

    setFilteredContacts: (contacts, callback) => {
      dispatch(set.filteredContacts(contacts))
      .then(() => {
        if (typeof callback == 'function') callback();
        else console.log("Callback is not a function.");
      });
    },

    setSelectedContact: (contact, callback) => {
      dispatch(set.selectedContact(contact))
      .then(() => {
        if (typeof callback == 'function') callback();
        else console.log("Callback is not a function.");
      });
    },

    invite: (options, callback) => {

      options.phoneNumber = StringMaster5000.formatPhoneNumber(options.phoneNumber);

      // Lambda.inviteDirect(options, (success) => {
      //   if (typeof callback == 'function') callback();
      //   else console.log("Callback is not a function.");
      // });

      Lambda.inviteViaPayment(options, (success) => {
        if (typeof callback == 'function') callback();
        else console.log("Callback is not a function.");
      });

    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( UserSearchView );
