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

    // main
    nativeContacts: state.getIn(['main', 'nativeContacts']),

  }
}

var allContactsArray;

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

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
