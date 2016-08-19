// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Partials from '../../helpers/Partials';

// Partial components
import UserPreview from '../../components/Previews/User/User';
import UserPic from '../../helpers/Partials';
import ArrowNav from '../../components/Navigation/Arrows/ArrowDouble';

// Styles
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create({
  textInput: {
    height: 60,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },

  // Confirmation
  confirmationWrap: {
    flex: 1.0,
    backgroundColor: colors.richBlack,
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
    color: colors.accent,
    paddingTop: 10,
  },

  confirmationPhone: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.icyBlue,
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

class UserSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      inputBackgroundColor: colors.white,
      inputTextColor: colors.richBlack,
      query: "",
    };
  }


  /**
    *   Start listening to Firebase
  **/
  componentWillMount() {
    this.props.initialize(this.props.nativeContacts);
    var contactList = "contactList/" + this.props.currentUser.uid;
    this.props.listen([contactList], { nativeContacts: this.props.nativeContacts });
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
        callback={() => {
          this._setSelectedContact(data);
          this.setState({query: data.username || data.first_name + " " + data.last_name});
        }} />
    );
  }


  _filterContacts(query) {
    var filtered = StringMaster5000.filterContacts(this.props.allContacts._dataBlob.s1, query);
    this.props.setFilteredContacts(filtered);
  }


  _setSelectedContact(data) {
    // Set selected contact in state
    this.props.setSelectedContact(data);

    // Determine and set new input colors
    var query = data.username || data.first_name + " " + data.last_name,
        queryType = (query[0] == "@") ? "username" : "phone";
    this._setInputColors(queryType);
  }


  _setInputColors(type) {
    if (type == "username") {
      this.setState({
        inputBackgroundColor: colors.accent,
        inputTextColor: colors.white,
      });
    } else if (type == "phone") {
      this.setState({
        inputBackgroundColor: colors.icyBlue,
        inputTextColor: colors.white,
      });
    } else if (type == "noMatch") {
      this.setState({
        inputBackgroundColor: colors.white,
        inputTextColor: colors.richBlack,
      });
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
          width={ 60 }
          height={ 60 }
          />

        { /* Full name */ }
        <Text style={styles.confirmationName}>
          { this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name }
        </Text>

        { /* Username or phone number */ }
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {(this.props.selectedContact.username)
            ? <Entypo style={{paddingTop: 10}} name="facebook" size={25} color={colors.accent} />
            : <Entypo style={{paddingTop: 10}} name="phone" size={25} color={colors.icyBlue} /> }
          <Text style={[{paddingLeft: 10}, (this.props.selectedContact.username) ? styles.confirmationUsername : styles.confirmationPhone]}>
            { (this.props.selectedContact.username)
                ? this.props.selectedContact.username
                : this.props.selectedContact.stylizedPhone }
          </Text>
        </View>

        { /* Confirmation Message */ }
        { (!this.props.selectedContact.username)
            ? <Text style={styles.confirmationMessage}>{"We'll invite " + this.props.selectedContact.first_name + " to join Payper."}</Text>
            : null }

        { /* Arrow nav */ }
        <ArrowNav
          arrowNavProps={ {right: true} }
          callbackRight={ () => this.props.setPageIndex(1) } />

      </View>
    );
  }


  render() {
    return(
      <View style={{flex: 1.0, justifyContent: 'center', backgroundColor: colors.white}}>
        { /* Query and ListView or Confirmation, depending on if a user is selected */ }
        <TextInput
          style={[styles.textInput, {backgroundColor: this.state.inputBackgroundColor, color: this.state.inputTextColor}]}
          placeholder={"Who are you splitting with?"}
          selectionColor={this.state.textInputColor}
          onChangeText={(query) => {
            this.setState({query: query});
            this._filterContacts(query);
            if (this.props.selectedContact && query == this.props.selectedContact.username && query != "") {
              console.log("Setting username colors");
              this._setInputColors("username");
            } else if (this.props.selectedContact && query == this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name && query != " ") {
              console.log("Setting phone colors");
              this._setInputColors("phone");
            } else {
              console.log("Setting noMatch colors");
              this._setInputColors("noMatch");
            }
          }}
          autoFocus={true}
          autoCorrect={false}
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


        { /* Render either confirmation page or */
          (!StringMaster5000.checkIf(this.state.query).isEmpty )
            ? (this.state.query == this.props.selectedContact.username || this.state.query == this.props.selectedContact.first_name + " " + this.props.selectedContact.last_name)
              ? this._getConfirmation()
              : this._getContactList()
            : this._getContactList() }

      </View>
    );
  }
};

export default UserSearch;
