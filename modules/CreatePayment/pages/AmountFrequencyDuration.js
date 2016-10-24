// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Animated, Easing, Keyboard, TouchableHighlight } from 'react-native';

// Components
import DynamicHorizontalUserList from '../../../components/DynamicHorizontalUserList/DynamicHorizontalUserList';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class AmountFrequencyDuration extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardOffset = new Animated.Value(0);
    this.colorInterpolator = new Animated.Value(0);
    this.frequencyPickerOffsetBottom = new Animated.Value(-60);

    this.state = {
      amount: 0,
      frequency: "",
      duration: 0,
      submitText: "Amount must be between $1 and $3000",
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
    this.interpolateSubmitColor({ toValue: 350 });
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

  interpolateSubmitColor(options) {
    Animated.spring(this.colorInterpolator, {
      toValue: options.toValue,
    }).start();
  }

  showFrequencyMenu() {
    Animated.timing(this.frequencyPickerOffsetBottom, {
      toValue: 0,
      duration: 200,
      easing: Easing.elastic(1)
    }).start();
  }

  hideFrequencyMenu() {
    Animated.timing(this.frequencyPickerOffsetBottom, {
      toValue: -60,
      duration: 200,
      easing: Easing.elastic(1)
    }).start();
  }

  handleSubmit() {
    if (this.state.submitText === "Next") {
      this.refs[this.state.focusedInputIndex].blur();
      this.refs[this.state.focusedInputIndex + 1].focus();
    } else if (this.state.submitText === "Continue") {
      this.props.dismissKeyboard();
      this.props.induceState({ amount: this.state.amount, frequency: this.state.frequency, duration: this.state.duration });
      this.props.nextPage();
    }
  }

  handleKeyPress(e) {
    if (e.nativeEvent.key === 'Enter') {
      if (this.state.focusedInputIndex === 2) {
        this.handleSubmit()
      } else {
        this.refs[this.state.focusedInputIndex].blur();
        this.refs[this.state.focusedInputIndex + 1].focus();
      }
    }
  }

  validateAmount(input) {
    let newState = {},
        valid = input > 0 && input < 3001;

    newState.amount = input;
    newState.submitText = (valid) ? "Next" : "Amount must be between $1 and $3000";

    return newState;
  }

  validateFrequency(input) {
    input = input.toLowerCase().trim();

    let newState = {},
        valid = input === "month" || input === "week" || input === "monthly" || input === "weekly";

    newState.frequency = (input === "month" || input === "monthly") ? "MONTHLY" : (input === "week" || input === "weekly") ? "WEEKLY" : "";
    newState.submitText = (valid) ? "Next" : "Frequncy must be per 'month' or 'week'";

    return newState;
  }

  validateDuration(input) {
    let newState = {},
        amountIsValid = this.state.amount > 0 && this.state.amount < 1000,
        frequencyIsValid = this.state.frequency === "MONTHLY" || this.state.frequency === "WEEKLY",
        durationIsValid = input > 0 && input < 1000;

    newState.duration = input;

    if (!amountIsValid) newState.submitText = "Amount must be between $1 and $3000";
    else if (!frequencyIsValid) newState.submitText = "Frequency must be per 'month' or 'week'";
    else if (!durationIsValid) newState.submitText = "Duration must be between 1 and 999";
    else newState.submitText = "Continue";

    return newState;
  }

  handleChangeText(input) {
    let newState;

    // Determine what's being inputted and validate it
    if (this.state.focusedInputIndex === 0)
      newState = this.validateAmount(input);
    else if (this.state.focusedInputIndex === 1)
      newState = this.validateFrequency(input);
    else if (this.state.focusedInputIndex === 2)
      newState = this.validateDuration(input);

    // Interpolate the submit button's background color
    if (newState.submitText === "Next" || newState.submitText === "Continue")
      this.interpolateSubmitColor({ toValue: 0 });
    else
      this.interpolateSubmitColor({ toValue: 350 });

    // Trigger rerender
    this.setState(newState);
  }

  handleFocus(i) {
    let newState;

    // Determine which input was focused, validate its contents
    if (i === 0) {
      newState = this.validateAmount(this.state.amount);
      this.hideFrequencyMenu();
    } else if (i === 1) {
      newState = this.validateFrequency(this.state.frequency);
      this.showFrequencyMenu();
    } else if (i === 2) {
      newState = this.validateDuration(this.state.duration);
      this.hideFrequencyMenu();
    }

    // Interpolate the submit button's background color
    if (newState.submitText === "Next" || newState.submitText === "Continue")
      this.interpolateSubmitColor({ toValue: 0 });
    else
      this.interpolateSubmitColor({ toValue: 350 });

    // Tack on newly focused text input's index to the state
    newState.focusedInputIndex = i;

    // Trigger rerender
    this.setState(newState);
  }

  handleFrequencyPick(f) {
    this.refs["1"].setNativeProps({ text: (f === "WEEKLY") ? "week" : "month" });
    this.handleChangeText((f === "WEEKLY") ? "week" : "month");
    this.refs["1"].blur();
    this.refs["2"].focus();
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

        { /* Inputs */ }
        <View style={styles.inputWrap}>
          <View style={styles.row}>
            <Text style={styles.text}>$</Text>
            <TextInput ref={"0"}
              style={[styles.text, styles.textInput, { width: 60 }]}
              placeholder={"0.00"}
              returnKeyType={"next"} keyboardType={"numeric"}
              autoCorrect={false} autoCapitalize={"none"}
              onKeyPress={(e) => this.handleKeyPress(e)}
              onChangeText={(text) => this.handleChangeText(text)}
              onFocus={() => this.handleFocus(0)} />

            <Text style={styles.text}>per</Text>
            <TextInput ref={"1"}
              style={[styles.text, styles.textInput]}
              placeholder={"month"}
              returnKeyType={"next"} keyboardType={"default"}
              autoCorrect={false} autoCapitalize={"none"}
              onKeyPress={(e) => this.handleKeyPress(e)}
              onChangeText={(text) => this.handleChangeText(text)}
              onFocus={() => this.handleFocus(1)} />

            <Text style={styles.text}>for</Text>
            <TextInput ref={"2"}
              style={[styles.text, styles.textInput, { width: 50 }]}
              placeholder={"0"}
              returnKeyType={"done"} keyboardType={"number-pad"}
              autoCorrect={false} autoCapitalize={"none"}
              maxLength={3}
              onKeyPress={(e) => this.handleKeyPress(e)}
              onChangeText={(text) => this.handleChangeText(text)}
              onFocus={() => this.handleFocus(2)} />

            <Text style={styles.text}>{(this.state.frequency === "WEEKLY") ? "weeks" : "months"}</Text>
          </View>
        </View>

        { /* Submit button */ }
        <Animated.View style={{position: 'absolute', bottom: this.keyboardOffset, left: 0, right: 0}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleSubmit()}>

            <View>
              { /* Continue button */ }
              <Animated.View style={{ height: 60, backgroundColor: this.state.submitBackgroundColor, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.white, alignSelf: 'center', textAlign: 'center' }}>
                  { this.state.submitText }
                </Text>
              </Animated.View>

              { /* Frequency picker */ }
              <Animated.View style={[styles.frequencyPicker, { bottom: this.frequencyPickerOffsetBottom, backgroundColor: colors.richBlack }]}>
                <TouchableHighlight
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.handleFrequencyPick("MONTHLY")}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1.0, width: dimensions.width * 0.5, backgroundColor: 'rgba(145, 145, 145, 0)' }}>
                    <Text style={[styles.text, { color: colors.accent, fontSize: 20 }]}>month</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.handleFrequencyPick("WEEKLY")}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1.0, width: dimensions.width * 0.5, backgroundColor: 'rgba(145, 145, 145, 0.1)' }}>
                    <Text style={[styles.text, { color: colors.accent, fontSize: 20 }]}>week</Text>
                  </View>
                </TouchableHighlight>
              </Animated.View>
            </View>

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
    paddingTop: 0,
  },
  inputWrap: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1.0
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width,
    flexWrap: 'wrap',
    paddingTop: 12.5,
    paddingLeft: 40,
    paddingRight: 40
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '200',
    color: colors.richBlack
  },
  textInput: {
    width: 70,
    height: 40,
    margin: 8,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 4
  },
  frequencyPicker: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row'
  }
});
