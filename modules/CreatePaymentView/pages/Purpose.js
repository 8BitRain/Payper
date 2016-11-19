// Dependencies
import React from 'react';
import { View, Text, TextInput, Animated, Easing, StyleSheet, Dimensions, Keyboard, TouchableHighlight } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class Purpose extends React.Component {
  constructor(props) {
    super(props);

    this.payRequestButtonOffsetRight = new Animated.Value(0);
    this.confirmButtonOffsetRight = new Animated.Value((-1) * dimensions.width);
    this.successOffsetRight = new Animated.Value(-500);
    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);
    this.infoHeight = new Animated.Value(150);

    this.state = {
      purpose: "",
      confirmText: "",
      type: "",
      submittable: false,
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
      infoLayoutInitialized: false,
      success: false,
    };
  }

  componentDidMount() {
    // Subscribe to keyboard events
    _keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
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
    var curr;
    for (var i = 0; i < this.props.payment.users.length; i++) {
      curr = this.props.payment.users[i];
      this.props.sendPayment({
        user: curr,
        paymentInfo: {
          amount: this.props.payment.amount,
          frequency: this.props.payment.frequency,
          payments: this.props.payment.duration,
          purpose: this.state.purpose,
          type: this.state.type,
          token: this.props.currentUser.token,
        },
      });
    }

    // Trigger success animation
    Animated.sequence([
      Animated.timing(this.successOffsetRight, {
        toValue: (dimensions.width - 100) / 2,
        duration: 300,
        easing: Easing.elastic(0.25),
      }),
      Animated.timing(this.successOffsetRight, {
        toValue: dimensions.width + 400,
        duration: 200,
        easing: Easing.elastic(1),
        delay: 800,
      }),
    ]).start(() => {
      this.props.toggleModal();
    });
  }

  _handleKeyPress(e) {
    if (e.nativeEvent.key == "Enter" && this.refs.purposeInput.isFocused()) this._handleSubmit();
  }

  _handleChangeText(purpose) {
    // Update input values in state
    this.setState({ purpose: purpose });

    // Update submit button
    // if (purpose) {
    //   if (purpose.length <= 30) {
    //     this._interpolateSubmitColor({ toValue: 0 });
    //     this.setState({ submitText: "Continue", submittable: true });
    //   } else {
    //     this._interpolateSubmitColor({ toValue: 350 });
    //     this.setState({ submitText: "Payment purposes are capped at 50 characters", submittable: false });
    //   }
    // } else {
    //   this._interpolateSubmitColor({ toValue: 350 });
    //   this.setState({ submitText: "Please enter a payment purpose", submittable: false });
    // }
  }

  _showConfirmButton(type) {
    if (this.state.purpose.length == 0) return;

    this.setState({ confirmText: "Send " + type, type: type, submittable: true });

    // Trigger animation
    Animated.parallel([
      Animated.timing(this.confirmButtonOffsetRight, {
        toValue: 0,
        duration: 200,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.payRequestButtonOffsetRight, {
        toValue: dimensions.width,
        duration: 200,
        easing: Easing.elastic(1),
      }),
    ]).start();
  }

  _hideConfirmButton() {
    this.setState({ confirmText: "", type: "", submittable: false });

    // Trigger animation
    Animated.parallel([
      Animated.timing(this.confirmButtonOffsetRight, {
        toValue: (-1) * dimensions.width,
        duration: 200,
        easing: Easing.elastic(1),
      }),
      Animated.timing(this.payRequestButtonOffsetRight, {
        toValue: 0,
        duration: 200,
        easing: Easing.elastic(1),
      }),
    ]).start();
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
          autoCorrect={false} autoFocus={false} autoCapitalize={"sentences"}
          onChangeText={(text) => this._handleChangeText(text)}
          onKeyPress={(e) => this._handleKeyPress(e)}
          maxLength={30}
          keyboardType={"default"} />

        { /* Submit button */ }
        <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: this.keyboardOffset, left: 0, right: this.payRequestButtonOffsetRight}}>
          { /* Request*/ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._showConfirmButton("request")}>

            <Animated.View style={{ width: dimensions.width / 2, height: 60, backgroundColor: '#11ac53', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '400', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                { "Request" }
              </Text>
            </Animated.View>

          </TouchableHighlight>

          { /* Pay */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._showConfirmButton("payment")}>

            <Animated.View style={{ width: dimensions.width / 2, height: 60, backgroundColor: colors.alertGreen, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '400', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                { "Pay" }
              </Text>
            </Animated.View>

          </TouchableHighlight>
        </Animated.View>

        { /* Confirm button */ }
        <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: this.keyboardOffset, right: this.confirmButtonOffsetRight}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._handleSubmit()}>

            <View style={{ width: dimensions.width * 0.8, height: 60, backgroundColor: colors.alertGreen, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto', fontSize: (this.props.activeFundingSource) ? 16 : 18, fontWeight: '400', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                { this.state.confirmText }
                {(this.props.activeFundingSource) ? "\n(" + this.props.activeFundingSource.name + ")" : null }
              </Text>
            </View>

          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._hideConfirmButton()}>

            <View style={{ width: dimensions.width * 0.2, height: 60, backgroundColor: colors.alertRed, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name={"cross"} size={20} color={colors.white} />
            </View>

          </TouchableHighlight>
        </Animated.View>

        { /* Success alert */ }
        <Animated.View style={[styles.successBox, { right: this.successOffsetRight }]}>
          <Entypo name={"check"} size={36} color={colors.white} />
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
  },
  successBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: (dimensions.height - 100) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 4,
  },
});

export default Purpose;
