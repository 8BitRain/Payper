// Dependencies
import React from 'react';
import { View, Text, TextInput, Animated, StyleSheet, Dimensions, DeviceEventEmitter, TouchableHighlight } from 'react-native';

// Components
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class Purpose extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);
    this.infoHeight = new Animated.Value(150);

    this.state = {
      purpose: "",
      submitText: "Please enter a payment purpose",
      submittable: false,
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
      infoLayoutInitialized: false,
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
    Animated.parallel([
      Animated.timing(this.infoHeight, {
        toValue: 0,
        duration: 150
      }),
      Animated.spring(this.keyboardOffset, {
        toValue: e.endCoordinates.height,
        friction: 6
      }),
    ]).start();
  }

  _keyboardWillHide(e) {
    Animated.parallel([
      Animated.timing(this.infoHeight, {
        toValue: 150,
        duration: 150
      }),
      Animated.spring(this.keyboardOffset, {
        toValue: 0,
        friction: 6
      }),
    ]).start();
  }

  _interpolateSubmitColor(options) {
    Animated.spring(this.colorInterpolator, {
      toValue: options.toValue,
    }).start();
  }

  _handleSubmit() {
    this.props.dismissKeyboard();
    if (!this.state.submittable) return;
    var payment = {
      amount: this.props.payment.amount,
      duration: this.props.payment.duration,
      users: this.props.payment.users,
      purpose: this.state.purpose,
    };
  }

  _handleKeyPress(e) {
    if (e.nativeEvent.key == "Enter") {
      if (this.refs.purposeInput.isFocused()) this._handleSubmit();
    }
  }

  _handleChangeText(purpose) {
    // Update input values in state
    this.setState({ purpose: purpose });

    // Update submit button
    if (purpose) {
      if (purpose.length <= 30) {
        this._interpolateSubmitColor({ toValue: 0 });
        this.setState({ submitText: "Continue", submittable: true });
      } else {
        this._interpolateSubmitColor({ toValue: 350 });
        this.setState({ submitText: "Payment purposes are capped at 50 characters", submittable: false });
      }
    } else {
      this._interpolateSubmitColor({ toValue: 350 });
      this.setState({ submitText: "Please enter a payment purpose", submittable: false });
    }
  }

  render() {
    return(
      <View style={styles.wrap}>
        <Animated.View style={{ height: this.infoHeight, overflow: "hidden" }}>

          { /* List of selected users */ }
          <DynamicHorizontalUserList
            backgroundColor={'transparent'}
            displayOnly
            centerContent
            contacts={this.props.selectedContacts}
            handleSelect={(user) => this._handleSelect(user)} />

          { /* Payment summary */ }
          <Text style={[styles.promptText, { marginTop: 20 }]}>
            { "$" + this.props.payment.amount + " per month for " + this.props.payment.duration + " months" }
          </Text>
        </Animated.View>

        { /* "Purpose:" */ }
        <Text style={styles.promptText}>
          { "Purpose:" }
        </Text>

        { /* Amount input */ }
        <TextInput
          ref="purposeInput"
          style={styles.purposeInput}
          placeholderFontFamily={"Roboto"}
          placeholderTextColor={colors.lightGrey}
          placeholder={"Toilet paper"}
          defaultValue={this.state.purpose}
          autoCorrect={false} autoFocus autoCapitalize={"sentences"}
          onChangeText={(text) => this._handleChangeText(text)}
          onKeyPress={(e) => this._handleKeyPress(e)}
          maxLength={30}
          keyboardType={"default"} />

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
      justifyContent: 'flex-start',
      width: dimensions.width,
      backgroundColor: colors.white,
      paddingTop: 20,
    },
    purposeInput: {
      fontFamily: 'Roboto',
      fontSize: 18,
      fontWeight: '200',
      color: colors.richBlack,
      textAlign: 'center',
      width: dimensions.width * 0.7,
      marginLeft: dimensions.width * 0.15,
      marginTop: 25,
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      height: 50,
    },
    promptText: {
      fontFamily: 'Roboto',
      fontSize: 22,
      fontWeight: '200',
      color: colors.richBlack,
      padding: 6,
      textAlign: 'center',
    }
  });

export default Purpose;
