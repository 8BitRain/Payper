// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';

// Partial components
import DynamicUserPreview from '../../components/DynamicUserPreview/DynamicUserPreview';
import DynamicHorizontalUserList from '../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

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

class Invite extends React.Component {
  constructor(props) {
    super(props);

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.allContacts = this.props.nativeContacts;
    this.filteredContacts = [];

    this.state = {
      inputBackgroundColor: colors.white,
      inputTextColor: colors.richBlack,
      query: "",
      selectedContacts: [],
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.allContacts),
    };
  }

  /**
    *   (1) Update selected value of user object in allContacts array
    *   (2) Update this.state.selectedContacts
  **/
  _handleSelect(user) {
    if (user.selected) {
      user.selected = false;
      if (this.state.selectedContacts.length > 1) {
        var contacts = [];
        for (var c in this.state.selectedContacts)
          if (this.state.selectedContacts[c].phone != user.phone) contacts.push(this.state.selectedContacts[c]);
        this.setState({ selectedContacts: contacts });
      } else this.setState({ selectedContacts: [] });
    } else {
      user.selected = true;
      this.state.selectedContacts.push(user);
      this.setState({ selectedContacts: this.state.selectedContacts });
    }

    console.log("allContacts post-select:", this.allContacts);
  }

  _filterContacts(query) {
    console.log("Filtering based on query:", query);
    var filtered = SetMaster5000.filterContacts(this.allContacts, query);
    this.setState({ dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(filtered) });
  }

  _renderRow(user) {
    return(
      <DynamicUserPreview
        user={user}
        selected={user.selected}
        touchable
        callbackSelect={() => this._handleSelect(user)} />
    );
  }

  render() {
    return(
      <View style={{flex: 1.0, justifyContent: 'center', backgroundColor: colors.white}}>

        { /* Query and ListView or Confirmation, depending on if a user is selected */ }
        <TextInput
          style={[styles.textInput, {backgroundColor: this.state.inputBackgroundColor, color: this.state.inputTextColor}]}
          placeholder={"Who would you like to invite?"}
          selectionColor={this.state.textInputColor}
          onChangeText={(query) => this._filterContacts(query)}
          autoFocus={true}
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          returnKeyType={"next"}
          defaultValue={""} />

        { /* List of selected users */ }
        <DynamicHorizontalUserList
          contacts={this.state.selectedContacts}
          handleDeselect={() => this._handleDeselect()} />

        { /* Contact ListView */ }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />

      </View>
    );
  }
};

export default Invite;
