// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';

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
    allContactsArray: state.getIn(['userSearch', 'allContactsArray']),
    allContactsMap: state.getIn(['userSearch', 'allContactsMap']),
    filteredContactsMap: state.getIn(['userSearch', 'filteredContactsMap']),
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
      dispatch(set.allContactsMap(SetMaster5000.arrayToMap(nativeContacts)));
      dispatch(set.allContactsArray(nativeContacts));
    },

    listen: (endpoints, options) => {
      Firebase.listenTo(endpoints, (response) => {
        if (response.value) {
          var payperContactsArray = SetMaster5000.contactsToArray(response.value);
          var allContactsArray = payperContactsArray.concat(options.nativeContacts);
          var allContactsMap = SetMaster5000.arrayToMap(allContactsArray);
          dispatch(set.allContactsMap(allContactsMap));
          dispatch(set.allContactsArray(allContactsArray))
        }
      });

      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {
      Firebase.stopListeningTo(endpoints);
      dispatch(set.activeFirebaseListeners([]));
    },

    setFilteredContacts: (contacts, callback) => {
      dispatch(set.filteredContactsMap(contacts))
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
      Lambda.inviteViaPayment(options, (success) => {
        if (typeof callback == 'function') callback();
        else console.log("Callback is not a function.");
      });
    },
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( UserSearchView );
