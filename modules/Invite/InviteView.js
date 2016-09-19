// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Animated, DeviceEventEmitter } from 'react-native';

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';
import * as Lambda from '../../services/Lambda';

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

    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      inputBackgroundColor: colors.white,
      inputTextColor: colors.richBlack,
      query: "",
      selectedContacts: [],
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.allContacts),
      submitText: "No contacts are selected",
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350, 700], // Green, transparent, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    };
  }

  componentDidMount() {
    // Subscribe to keyboard events
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    // Unsubscribe from keyboard events
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  componentWillMount() {
    this._interpolateSubmitColor({ toValue: 350 });
  }

  _keyboardWillShow(e) {
    Animated.spring(this.keyboardOffset, {
      toValue: e.endCoordinates.height,
      friction: 6
    }).start();
  }

  _keyboardWillHide(e) {
    Animated.spring(this.keyboardOffset, {
      toValue: 0,
      friction: 6
    }).start();
  }

  _interpolateSubmitColor(options) {
    Animated.spring(this.colorInterpolator, {
      toValue: options.toValue,
    }).start();
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
      } else {
        this.setState({
          selectedContacts: [],
          submitText: "No contacts are selected",
         });
        this._interpolateSubmitColor({ toValue: 700 });
      }
    } else {
      user.selected = true;
      this.state.selectedContacts.push(user);
      this.setState({
        selectedContacts: this.state.selectedContacts,
        submitText: "Continue",
       });
      this._interpolateSubmitColor({ toValue: 0 });
    }
  }

  _handleSubmit() {
    if (this.state.selectedContacts.length > 0) {
      var options = {
        phoneNumbers: [],
        name: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
        token: this.props.currentUser.token,
      }

      // Extract phone numbers from selected contacts
      for (var c in this.state.selectedContacts) {
        options.phoneNumbers.push(this.state.selectedContacts[c].phone);
      }

      // Submit to Lambda
      Lambda.inviteDirect(options, (res) => {
        console.log("Inite callback received:", res);
      });
    }
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
          keyboardDismissMode={"on-drag"}
          enableEmptySections />

        { /* Submit button */ }
        <Animated.View style={{position: 'absolute', bottom: this.keyboardOffset, left: 0, right: 0}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._handleSubmit()}>

            <Animated.View style={{ height: 45, backgroundColor: this.state.submitBackgroundColor, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                { this.state.submitText }
              </Text>
            </Animated.View>

          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
};

export default Invite;
