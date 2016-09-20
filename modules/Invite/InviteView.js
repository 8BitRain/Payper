// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Animated, Easing, DeviceEventEmitter } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Async from '../../helpers/Async';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';
import * as Lambda from '../../services/Lambda';
import * as Validators from '../../helpers/validators';

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
    backgroundColor: colors.white,
    color: colors.richBlack,
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

  alertWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: dimensions.width,
    height: dimensions.height * 0.9,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
});

class Invite extends React.Component {
  constructor(props) {
    super(props);

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.allContacts = this.props.nativeContacts;
    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);
    this.alertOffsetX = new Animated.Value(dimensions.width * 2.0);
    this.alertOpacity = new Animated.Value(0);

    this.state = {
      query: "",
      selectionMap: {},
      selectedContacts: [],
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.allContacts),
      submitText: "No contacts are selected",
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, transparent, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
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

  _reset() {
    this.setState({
      query: "",
      selectionMap: {},
      selectedContacts: [],
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.allContacts),
      submitText: "No contacts are selected",
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    });

    this._interpolateSubmitColor({ toValue: 350 });

    this.alertOffsetX = new Animated.Value(dimensions.width * 2.0);
    this.alertOpacity = new Animated.Value(0);

    this.refs.textInput.setNativeProps({text: ''});
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

  _showAlert() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.alertOffsetX, {
          toValue: 0,
          duration: 550,
          easing: Easing.elastic(1),
        }),
        Animated.timing(this.alertOpacity, {
          toValue: 1.0,
          duration: 200,
          easing: Easing.elastic(1),
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.alertOffsetX, {
          toValue: dimensions.width * -2.0,
          duration: 550,
          easing: Easing.elastic(1),
          delay: 800,
        }),
        Animated.timing(this.alertOpacity, {
          toValue: 0.0,
          duration: 200,
          easing: Easing.elastic(1),
          delay: 800,
        }),
      ]),
    ])
    .start();

    setTimeout(() => {
      this._reset();
    }, 550);
  }

  /**
    *   (1) Update selection map value
    *   (2) Update this.state.selectedContacts
    *   (3) Explicitly trigger re-render of all affected components
    *   (4) Interpolate submit button's background color
  **/
  _handleSelect(user) {
    // (1) Update this.state.selectionMap
    this.state.selectionMap[user.phone] = !this.state.selectionMap[user.phone];

    // (2) Update this.state.selectedContacts
    if (this.state.selectionMap[user.phone]) {
      this.state.selectedContacts.push(user);
    } else {
      var i = this.state.selectedContacts.indexOf(user);
      this.state.selectedContacts.splice(i, 1);
    }

    // (3) Explicitly trigger re-render
    this.setState({
      selectionMap: this.state.selectionMap,
      selectedContacts: this.state.selectedContacts,
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.state.dataSource._dataBlob.s1),
      submitText: (this.state.selectedContacts.length > 0) ? "Continue" : "No contacts are selected",
     });

     // (4) Interpolate submit button's background color
     this._interpolateSubmitColor({ toValue: (this.state.selectedContacts.length > 0) ? 0 : 350 });
  }

  _handleSubmit() {
    var options = {
      phoneNumbers: [],
      name: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
      token: this.props.currentUser.token,
    }

    if (this.state.selectedContacts.length > 0) {
      // Extract phone numbers from selected contacts
      for (var c in this.state.selectedContacts) {
        options.phoneNumbers.push(this.state.selectedContacts[c].phone);
      }

      // Submit POST request
      Lambda.inviteDirect(options);

      this._showAlert();
    } else if (Validators.validatePhone(this.state.query).valid) {
      console.log("Input:", this.state.query);
      options.phoneNumbers.push(this.state.query);

      // Submit POST request
      Lambda.inviteDirect(options);

      this._showAlert();
    }
  }

  _filterContacts(query) {
    // Update this.state.query
    this.setState({ query: query });

    // Update submit button
    if (Validators.validatePhone(query).valid) {
      this._interpolateSubmitColor({ toValue: 0 });
      this.setState({ submitText: "Invite this phone number" });
    } else if (this.state.selectedContacts.length == 0) {
      this._interpolateSubmitColor({ toValue: 350 });
      this.setState({ submitText: "No contacts are selected" });
    }

    // Update contacts rendered by ListView
    var filtered = SetMaster5000.filterContacts(this.allContacts, query);
    this.setState({ dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(filtered) });
  }

  _renderRow(user) {
    return(
      <DynamicUserPreview
        user={user}
        selected={this.state.selectionMap[user.phone]}
        touchable
        callbackSelect={() => this._handleSelect(user)} />
    );
  }

  render() {
    return(
      <View style={{flex: 1.0, justifyContent: 'center', backgroundColor: colors.white}}>

        { /* Query and ListView or Confirmation, depending on if a user is selected */ }
        <TextInput
          ref="textInput"
          style={styles.textInput}
          placeholder={"Who would you like to invite?"}
          selectionColor={this.state.textInputColor}
          onChangeText={(query) => this._filterContacts(query)}
          autoFocus={true}
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          returnKeyType={"next"} />

        { /* List of selected users */ }
        <DynamicHorizontalUserList
          contacts={this.state.selectedContacts}
          handleSelect={(user) => this._handleSelect(user)} />

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

            <Animated.View style={{ height: 60, backgroundColor: this.state.submitBackgroundColor, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                { this.state.submitText }
              </Text>
            </Animated.View>

          </TouchableHighlight>
        </Animated.View>

        { /* Success alert */ }
        <Animated.View style={[styles.alertWrap, { opacity: this.alertOpacity, left: this.alertOffsetX }]}>
          <Entypo name={"check"} size={50} color={colors.white} />
        </Animated.View>
      </View>
    );
  }
};

export default Invite;
