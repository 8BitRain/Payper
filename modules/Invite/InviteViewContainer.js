// Dependencies
import { connect } from 'react-redux';

// Helper functions
import * as Firebase from '../../services/Firebase';
import * as Lambda from '../../services/Lambda';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';

// Dispatch functions
import * as set from './InviteState';

// Base view
import InviteView from './InviteView';

// Decide which chunk of Redux global state our component will receive as props
function mapStateToProps(state) {
  return {

    // userSearch
    activeFirebaseListeners: state.getIn(['invite', 'activeFirebaseListeners']),
    allContactsArray: state.getIn(['invite', 'allContactsArray']),
    allContactsMap: state.getIn(['invite', 'allContactsMap']),
    filteredContactsMap: state.getIn(['invite', 'filteredContactsMap']),
    selectedContacts: state.getIn(['invite', 'selectedContacts']),
    empty: state.getIn(['invite', 'empty']),
    startedListening: state.getIn(['invite', 'startedListening']),

    // main
    currentUser: state.getIn(['main', 'currentUser']),
    nativeContacts: state.getIn(['main', 'nativeContacts']),

  }
}

var allContactsArray;

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    initialize: (nativeContacts) => {
      dispatch(set.allContactsMap(SetMaster5000.arrayToMap(nativeContacts)));
      dispatch(set.allContactsArray(nativeContacts));
    },

    listen: (endpoints, options, callback) => {

      // Ensure that we don't initialize more than one listener
      dispatch(set.startedListening(true));

      Firebase.listenTo(endpoints, (response) => {
        if (response.value) {

          switch (response.endpoint.split("/")[0]) {
            case "users":

              console.log("%cSuccessfully received global user list:", "color:green;font-weight:900;");
              console.log(response.value);

              // Convert Firebase JSON to array of user objects, tacking on section titles along the way
              var globalUserListArray = SetMaster5000.globalUserListToArray({ sectionTitle: "Contacts Who", users: response.value, uid: options.uid }),
                  newAllContactsArray;

              // Concatenate with currently rendered contact list
              newAllContactsArray = (allContactsArray) ? SetMaster5000.mergeArrays(allContactsArray, globalUserListArray) : globalUserListArray.concat(options.nativeContacts);
              allContactsArray = newAllContactsArray;

              // Convert contact array to map for ListView rendering
              var newAllContactsMap = SetMaster5000.arrayToMap(newAllContactsArray);

              // Set user lists in Redux store, triggering re-render of UserSearch ListView
              dispatch(set.allContactsMap(newAllContactsMap));
              dispatch(set.allContactsArray(newAllContactsArray));

            break;
          }
        }
      });

      dispatch(set.activeFirebaseListeners(endpoints));
    },

    stopListening: (endpoints) => {


      console.log("\n\n\n\n\nSTOPPED LISTENING\n\n\n\n");

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

export default connect( mapStateToProps, mapDispatchToProps )( InviteView );
