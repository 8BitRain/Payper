// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Animated, Keyboard, TouchableHighlight } from 'react-native';

// Components
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

class AmountAndDuration extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      amount: "",
      submitText: "Please enter an amount and duration",
      submittable: false,
      submitBackgroundColor: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Green, red
        outputRange: ['rgba(16, 191, 90, 1.0)', 'rgba(251, 54, 64, 1.0)'],
      }),
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

  _handleSubmit() {
    this.props.dismissKeyboard();
    if (!this.state.submittable) return;
    this.props.induceState({ amount: this.state.amount, duration: this.state.duration });
    this.props.nextPage();
  }

  _handleKeyPress(e) {
    if (e.nativeEvent.key == "Enter") {
      if (this.refs.amountInput.isFocused()) this.refs.durationInput.focus();
      else if (this.refs.durationInput.isFocused()) this._handleSubmit();
    }
  }

  _handleChangeText(inputs) {
    // Update input values in state
    this.setState({ amount: inputs.amount, duration: inputs.duration });

    // Update submit button
    if (inputs.amount > 0 && inputs.duration > 0) {
      if (inputs.amount <= 300) {
        this._interpolateSubmitColor({ toValue: 0 });
        this.setState({ submitText: "Continue", submittable: true });
      } else {
        this._interpolateSubmitColor({ toValue: 350 });
        this.setState({ submitText: "Payments are capped at $300 per month", submittable: false });
      }
    } else {
      this._interpolateSubmitColor({ toValue: 350 });
      this.setState({ submitText: "Please enter an amount and duration.", submittable: false });
    }
  }

  render() {
    return(
      <View style={styles.wrap}>
        { /* List of selected users */ }
        <DynamicHorizontalUserList
          backgroundColor={'transparent'}
          displayOnly
          centerContent
          contacts={this.props.selectedContacts}
          handleSelect={(user) => this._handleSelect(user)} />

        { /* Amount input */ }
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: dimensions.width }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            { /* Duration input */ }
            <TextInput
              ref="amountInput"
              style={styles.amountInput}
              placeholderFontFamily={"Roboto"}
              placeholderTextColor={colors.lightGrey}
              placeholder={"$0.00"}
              defaultValue={this.state.amount}
              autoCorrect={false} autoFocus={false} autoCapitalize={"none"}
              keyboardType={"numeric"}
              onChangeText={(text) => this._handleChangeText({ amount: text, duration: this.state.duration })}
              onKeyPress={(e) => this._handleKeyPress(e)} />

            <Text style={styles.promptText}>
              { "per month" }
            </Text>
          </View>

          { /* Amount input */ }
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              ref="durationInput"
              style={styles.amountInput}
              placeholderFontFamily={"Roboto"}
              placeholderTextColor={colors.lightGrey}
              placeholder={"0"}
              defaultValue={this.state.duration}
              autoCorrect={false} autoFocus={false} autoCapitalize={"none"}
              keyboardType={"number-pad"}
              onChangeText={(text) => this._handleChangeText({ amount: this.state.amount, duration: text })}
              onKeyPress={(e) => this._handleKeyPress(e)} />

            <Text style={styles.promptText}>
              { "months." }
            </Text>
          </View>
        </View>

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
  amountInput: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '200',
    color: colors.richBlack,
    textAlign: 'center',
    width: dimensions.width * 0.3,
    marginLeft: dimensions.width * 0.05,
    marginTop: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    height: 50,
  },
  promptText: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '200',
    color: colors.richBlack,
    padding: 10,
    textAlign: 'center',
  }
});

export default AmountAndDuration;
