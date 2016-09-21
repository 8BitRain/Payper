// Dependencies
import React from 'react';
import { Dimensions, StyleSheet, View, Text, TextInput, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Animated, Easing, DeviceEventEmitter } from 'react-native';

// Helpers
import * as Async from '../../../helpers/Async';
import * as StringMaster5000 from '../../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../../helpers/SetMaster5000';
import * as Lambda from '../../../services/Lambda';
import * as Validators from '../../../helpers/validators';

// Components
import DynamicUserPreview from '../../../components/DynamicUserPreview/DynamicUserPreview';
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class UserSelection extends React.Component {
  constructor(props) {
    super(props);

    this.allUsers = this.props.nativeContacts;
    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      query: "",
      selectionMap: {},
      selectedContacts: [],
      submitText: "No contacts are selected",
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
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
      submitText: "No contacts are selected",
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
    });

    this._interpolateSubmitColor({ toValue: 350 });

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

  /**
    *   (1) Update selection map value
    *   (2) Update this.state.selectedContacts
    *   (3) Explicitly trigger re-render of all affected components
    *   (4) Interpolate submit button's background color
  **/
  _handleSelect(user) {
    // (1) Update this.state.selectionMap
    var identifier = (user.uid) ? user.uid : user.phone;
    this.state.selectionMap[identifier] = !this.state.selectionMap[identifier];

    // (2) Update this.state.selectedContacts
    if (this.state.selectionMap[identifier]) {
      this.state.selectedContacts.push(user);
    } else {
      var i = this.state.selectedContacts.indexOf(user);
      this.state.selectedContacts.splice(i, 1);
    }

    // (3) Explicitly trigger re-render
    this.setState({
      selectionMap: this.state.selectionMap,
      selectedContacts: this.state.selectedContacts,
      dataSource: (this.props.filteredContactsMap.getRowCount() > 0) ? this.props.filteredContactsMap : this.props.allContactsMap,
      submitText: (this.state.selectedContacts.length > 0) ? "Continue" : "No contacts are selected",
     });

     // (4) Interpolate submit button's background color
     this._interpolateSubmitColor({ toValue: (this.state.selectedContacts.length > 0) ? 0 : 350 });

     // (5) Pass selectedContacts up to caller so that the array is available on
     //     the next two pages
     this.props.induceState({ selectedContacts: this.state.selectedContacts });
  }

  _handleSubmit() {
    this.props.dismissKeyboard();
    this.props.nextPage();
  }

  _filterContacts(query) {
    // Update this.state.query
    this.setState({ query: query });

    // Update contacts rendered by ListView
    var filtered = SetMaster5000.filterContacts(this.props.allContactsArray, query);
    this.props.setFilteredContacts(SetMaster5000.arrayToMap(filtered));
  }

  _renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{height: 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, paddingLeft: 20, backgroundColor: colors.offWhite}}>
        <Text>{ sectionTitle }</Text>
      </View>
    );
  }

  _renderRow(user) {
    return(
      <DynamicUserPreview
        user={user}
        selected={(user.uid) ? this.state.selectionMap[user.uid] : this.state.selectionMap[user.phone]}
        callbackSelect={() => this._handleSelect(user)} />
    );
  }

  render() {
    return(
      <View style={styles.wrap}>
        { /* Query and ListView or Confirmation, depending on if a user is selected */ }
        <TextInput
          ref="textInput"
          style={styles.textInput}
          placeholder={"Who are you paying or requesting?"}
          selectionColor={this.state.textInputColor}
          onChangeText={(query) => this._filterContacts(query)}
          autoFocus={true}
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          keyboardType={"default"}
          returnKeyType={"done"} />

        { /* List of selected users */ }
        <DynamicHorizontalUserList
          contacts={this.state.selectedContacts}
          handleSelect={(user) => this._handleSelect(user)} />

        { /* Contact ListView */ }
        <ListView
          dataSource={(this.props.filteredContactsMap.getRowCount() > 0) ? this.props.filteredContactsMap : this.props.allContactsMap}
          renderRow={this._renderRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
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
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    justifyContent: 'center',
    width: dimensions.width,
    backgroundColor: colors.white,
  },
  textInput: {
    height: 60,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white,
    color: colors.richBlack,
  },
});

export default UserSelection;
