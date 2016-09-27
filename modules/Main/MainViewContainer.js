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
import * as setInFundingSources from '../FundingSources/FundingSourcesState';
import * as setInUserSearch from '../UserSearch/UserSearchState';

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
    nativeContacts: state.getIn(['main', 'nativeContacts']),
    blockedUsers: state.getIn(['main', 'blockedUsers']),

    // payments
    activeFilter: state.getIn(['payments', 'activeFilter']),

    // userSearch
    allContactsArray: state.getIn(['userSearch', 'allContactsArray']),
    allContactsMap: state.getIn(['userSearch', 'allContactsMap']),
    filteredContactsMap: state.getIn(['userSearch', 'filteredContactsMap']),
    selectedContact: state.getIn(['userSearch', 'selectedContact']),
    empty: state.getIn(['userSearch', 'empty']),
    startedListening: state.getIn(['userSearch', 'startedListening']),

  }
}

// Decide which action creators our component will receive as props
function mapDispatchToProps(dispatch) {
  return {

    initialize: (callback) => {

      Async.get('user', (user) => {
        if (!user) {
          console.log("%cSign in failed.", "color:red;font-weight:900;");

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

              // Extract just the phone numbers, then update user's contactList
              var numbers = SetMaster5000.contactsArrayToNumbersArray(c);
              Lambda.updateContacts({ phoneNumbers: numbers, token: parsedUser.token });

              var parsedContacts = SetMaster5000.parseNativeContactList({
                phoneNumbers: numbers,
                contacts: c,
              });
              console.log("Filtered contacts:", parsedContacts);
            }
          });

          // Refresh session token every 20 minutes
          setInterval(function() {
            Firebase.getSessionToken((token) => {
              Async.set('session_token', token, () => {
                parsedUser.token = token;
                dispatch(set.currentUser(parsedUser));
              });
            });
          }, 1200 * 1000);

          if (typeof callback == 'function') callback(true);
          else console.log("Callback is not a function.");
        }
      });

    },

    listen: (endpoints, options, callback) => {

      var CURRENT_USER = options.currentUser,
          allContactsArray;

      Firebase.listenTo(endpoints, (response) => {
        switch (response.endpoint.split("/")[0]) {

          case "notifications":
            if (response.value) dispatch(set.notifications(response.value));
            else console.log("%c" + response.endpoint + " is null", "color:red;font-weight:900;");
          break;

          case "appFlags":
            if (response.value) dispatch(set.flags(response.value));
            else console.log("%c" + response.endpoint + " is null", "color:red;font-weight:900;");
          break;

          case "users":

            // Populate global user list in Redux store
            if (response.key == "users") {
              // Convert Firebase JSON to array of user objects, tacking on section titles along the way
              var globalUserListArray = SetMaster5000.globalUserListToArray({ sectionTitle: "Other Payper Users", users: response.value, uid: options.uid }),
                  newAllContactsArray;

              // Concatenate with currently rendered contact list
              newAllContactsArray = (allContactsArray) ? SetMaster5000.mergeArrays(allContactsArray, globalUserListArray) : globalUserListArray.concat(options.nativeContacts);
              allContactsArray = newAllContactsArray;

              // Convert contact array to map for ListView rendering
              var newAllContactsMap = SetMaster5000.arrayToMap(newAllContactsArray);

              // Set user lists in Redux store, triggering re-render of UserSearch ListView
              dispatch(setInUserSearch.allContactsMap(newAllContactsMap));
              dispatch(setInUserSearch.allContactsArray(newAllContactsArray));
            }

            if (response.value) {
              // Update funding source in Redux store
              if (response.value.fundingSource) {
                Lambda.getFundingSource({ token: options.currentUser.token }, (res) => {
                  if (res) {
                    var fundingSources = [],
                        account = {
                          name: (res.name) ? res.name : "Nameless Account",
                          bank: "Unknown",
                          accountNumber: "Unkown",
                          active: true,
                          status: res.status,
                          type: res.type,
                          id: res.id,
                          createdAt : res.created,
                          icon: "bank",
                        };

                    fundingSources.push(account);

                    dispatch(setInFundingSources.fundingSourcesArray(fundingSources));
                    dispatch(setInFundingSources.fundingSourcesDataSource(fundingSources));
                  }
                });
              } else {
                dispatch(setInFundingSources.fundingSourcesArray([]));
                dispatch(setInFundingSources.fundingSourcesDataSource([]));
              }

            // Update username in Redux store
            if (response.value.uid == CURRENT_USER.uid && response.value.username != CURRENT_USER.username) {
              console.log("Changing username from", CURRENT_USER.username, "to", response.value.username);
              var newUser = CURRENT_USER;
              newUser.username = response.value.username;
              CURRENT_USER = newUser;
              dispatch(set.currentUser(newUser));
            }

          } else {
            console.log("%c" + response.endpoint + " is null", "color:red;font-weight:900;");
          }
          break;

          case "contactList":
            // Convert Firebase JSON to array of user objects, tacking on section titles along the way
            var contactListArray = SetMaster5000.contactListToArray({ contacts: response.value }),
                newAllContactsArray;

            // Concatenate with native phone contact list
            newAllContactsArray = (allContactsArray) ? SetMaster5000.mergeArrays(allContactsArray, contactListArray) : contactListArray.concat(options.nativeContacts);
            allContactsArray = newAllContactsArray;

            // Convert contact array to map for ListView rendering
            var newAllContactsMap = SetMaster5000.arrayToMap(newAllContactsArray);

            // Set user lists in Redux store, triggering re-render of UserSearch ListView
            dispatch(setInUserSearch.allContactsMap(newAllContactsMap));
            dispatch(setInUserSearch.allContactsArray(newAllContactsArray));
          break;

          case "blocked":
            dispatch(set.blockedUsers(response.value));
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
      dispatch(set.bankAccounts([]));
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
      else if (page == "invite") dispatch(set.header(Headers.inviteHeader()));
      dispatch(set.currentPage(page));
    },

    setCurrentUser: (user) => {
      dispatch(set.currentUser(user));
    },

    setFilteredContacts: (contacts, callback) => {
      dispatch(setInUserSearch.filteredContactsMap(contacts))
      .then(() => {
        if (typeof callback == 'function') callback();
        else console.log("Callback is not a function.");
      });
    },

    setSelectedContact: (contact, callback) => {
      dispatch(setInUserSearch.selectedContact(contact))
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

export default connect( mapStateToProps, mapDispatchToProps )( MainView );
