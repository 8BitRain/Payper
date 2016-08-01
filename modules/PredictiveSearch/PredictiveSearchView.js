// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
const dimensions = Dimensions.get('window');

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Partials from '../../helpers/Partials';

// Partial components
import UserPreview from '../../components/Previews/User/User';
import Header from '../../components/Header/Header';
import UserPic from '../../helpers/Partials';
import ArrowNav from '../../components/Navigation/Arrows/ArrowDouble';

// Styles
import colors from '../../styles/colors';
const rowStyles = StyleSheet.create({
  wrap: {
    height: 100,
    width: dimensions.width,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bf3636',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#FFF',
  },
});
const styles = StyleSheet.create({
  textInput: {
    height: 40,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.white,
  },

  // Confirmation
  confirmationWrap: {
    flex: 1.0,
    backgroundColor: colors.darkGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 25,
  },

  confirmationPic: {
    width: dimensions.width * 0.5,
    height: dimensions.width * 0.5,
    borderRadius: (dimensions.width * 0.5) / 2,
  },

  confirmationName: {
    fontFamily: 'Roboto',
    fontSize: 22,
    color: colors.white,
    paddingTop: 10,
  },

  confirmationUsername: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.icyBlue,
    paddingTop: 10,
  },

  confirmationPhone: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.alertGreen,
    paddingTop: 10,
  },

  confirmationMessage: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.white,
    paddingTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },

});

class PredictiveSearchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      inputBackgroundColor: 'transparent',
    };
  }


  /**
    *   Start listening to Firebase
  **/
  componentDidMount() {
    this.props.listen(['TestContacts/FmXlDusbVKQTuqnAG22KX7yZKWL2']);
  }


  /**
    *   Stop listening to Firebase
  **/
  componentWillUnmount() {
    this.props.stopListening(this.props.activeFirebaseListeners);
  }


  _renderRow(data) {
    return(
      <UserPreview
        user={data}
        touchable
        callback={() => this._setSelectedContact(data)}
        />
    );
  }


  _setSelectedContact(data) {
    this.props.setSelectedContact(data, () => {
      this._setInputBackgroundColor(data.username || data.first_name + " " + data.last_name)
    });
  }


  _filterContacts(query) {
    var filtered = StringMaster5000.filterContacts(this.props.allContacts._dataBlob.s1, query);
    this.props.setFilteredContacts(filtered);
  }


  _setInputBackgroundColor(query) {
    var notEmpty = StringMaster5000.checkIf(query).isEmpty;

    if (notEmpty) {
      if (query == this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name || query == this.props.selectedContact.username)
        this.setState({inputBackgroundColor: colors.alertGreen});
      else if (this.state.inputBackgroundColor != 'transparent')
        this.setState({inputBackgroundColor: 'transparent'});
    }
  }


  _getContactList() {
    return(
      <ListView
        dataSource={(this.props.filteredContacts._dataBlob.s1.length > 0) ? this.props.filteredContacts : this.props.allContacts}
        renderRow={this._renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        enableEmptySections
        />
    );
  }


  _getConfirmation() {
    return(
      <View style={styles.confirmationWrap}>

        { /* Profile picture or initials */ }
        <UserPic
          pic={this.props.selectedContact.profile_pic}
          name={this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name}
          width={dimensions.width * 0.3}
          height={dimensions.width * 0.3}
          />

        { /* Full name */ }
        <Text style={styles.confirmationName}>
          { this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name }
        </Text>

        { /* Username or phone number */ }
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {(this.props.selectedContact.type == "facebook")
            ? <Entypo style={{paddingTop: 10}} name="facebook" size={25} color={colors.icyBlue}/>
            : <Entypo style={{paddingTop: 10}} name="phone" size={25} color={colors.alertGreen}/> }
          <Text style={(this.props.selectedContact.username) ? styles.confirmationUsername : styles.confirmationPhone}>
            { " +" + this.props.selectedContact.phone }
          </Text>
        </View>

        { /* Confirmation Message */ }
        {(!this.props.selectedContact.username)
          ? <Text style={styles.confirmationMessage}>{"We'll invite " + this.props.selectedContact.first_name + " to join Payper."}</Text>
          : null }

        { /* Arrow nav */ }
        <ArrowNav
          arrowNavProps={{right: true}}
          callbackRight={() => {
            this.props.invite({
              amount: 10,
              purpose: "Test payment invite",
              invitee: "Test Johnson",
              payments: 12,
              type: "payment",
              phoneNumber: this.props.selectedContact.phone,
              token: this.props.currentUser.token,
            }, (success) => {
              console.log("Payment invite was successful: " + success);
            });
          }}
          />

      </View>
    );
  }


  render() {
    return(
      <View style={{flex: 1.0}}>

        { /* Header */ }
        <View style={{flex: 0.1}}>
          <Header
            headerProps={{
              types: {
                "paymentIcons": true,
                "circleIcons": false,
                "settingsIcon": false,
                "closeIcon": true,
                "flowTabs": false,
              },
              numCircles: null,
            }}
            index={0}
            numNotifications={this.props.numNotifications}
            callbackSettings={() => this.props.toggleMenu()}
            />
        </View>

        { /* Query and ListView or Confirmation, depending on if a user is selected */ }
        <View style={{flex: 0.9, justifyContent: 'center', backgroundColor: colors.icyBlue}}>
          <TextInput
            style={[styles.textInput, {backgroundColor: this.state.inputBackgroundColor}]}
            placeholder={"Who are you splitting with?"}
            selectionColor={colors.white}
            onChangeText={ (query) => { this._filterContacts(query); this._setInputBackgroundColor(query); }}
            autoFocus={true}
            enablesReturnKeyAutomatically={true}
            returnKeyType={"next"}
            defaultValue={
              (this.props.selectedContact.username)
                ? this.props.selectedContact.username
                : (this.props.selectedContact.first_name)
                  ? this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name
                  : ""
            }
            />

          { (this.props.selectedContact.username || this.props.selectedContact.first_name )
            ? this._getConfirmation()
            : this._getContactList() }
        </View>
      </View>
    );
  }
};

export default PredictiveSearchView;
