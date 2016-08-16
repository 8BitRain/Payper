// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Dispatch functions
import * as set from './UserSearchState';
import * as setPayment from '../CreatePayment/CreatePaymentState';

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
    nativeContacts: state.getIn(['main', 'nativeContacts']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    initialize: (nativeContacts) => {
      dispatch(set.allContacts(nativeContacts));
    },

    listen: (endpoints, options) => {
      Firebase.listenTo(endpoints, (response) => {
        if (response.value) {
          var contacts = StringMaster5000.contactsToArray(response.value);

          console.log("%cConcatenated Payper and native contacts:", "color:green;font-weight:900;")
          contacts = contacts.concat(options.nativeContacts);
          console.log(contacts);

          dispatch(set.allContacts(contacts));
        }
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