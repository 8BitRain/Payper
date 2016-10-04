// Dependencies
import React from 'react';
import { View, Text, TextInput, TouchableHighlight, StyleSheet, Dimensions, Animated, Easing, DeviceEventEmitter } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../../styles/colors';

// Screen dimensions
const dims = Dimensions.get('window');
const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);

export default class StickyTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.offsetBottom = new Animated.Value(0);
    this.loadingOpacity = new Animated.Value(0);

    this.submitColorInterpolator = new Animated.Value(0);
    this.submitColor = this.submitColorInterpolator.interpolate({
      inputRange: [0, 350],
      outputRange: ['rgba(251, 54, 64, 1.0)', 'rgba(16, 191, 90, 1.0)'] // Red, green
    });

    this.state = {
      submitText: "Please enter a valid email and password",
      errorMessage: null,
      loading: false,
      loginParams: {
        email: "",
        password: ""
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // Update loading message
    if (nextProps.loading != this.state.loading) {
      this.setState({ loading: nextProps.loading });
      this.animate({ target: this.loadingOpacity, toValue: (nextProps.loading) ? 1.0 : 0.0 });

      // Update error message
      if (nextProps.errorMessage != this.state.errorMessage) {
        this.setState({ errorMessage: nextProps.errorMessage });
        this.animate({ target: this.submitColorInterpolator, toValue: 0 });
      }
    } else {
      this.animate({ target: this.loadingOpacity, toValue: (nextProps.loading) ? 1.0 : 0.0 });
    }

    // Update submit button
    if (nextProps.validations.email && nextProps.validations.password) {
      this.animate({ target: this.submitColorInterpolator, toValue: 350 });
      this.setState({ submitText: "Continue" });
    } else {
      this.animate({ target: this.submitColorInterpolator, toValue: 0 });
      this.setState({ submitText: "Please enter a valid email and password" });
    }
  }

  animate(params) {
    Animated.timing(params.target, {
      toValue: params.toValue,
      duration: 125
    }).start();
  }

  componentDidMount() {
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  _keyboardWillShow(e) {
    Animated.timing(this.offsetBottom, {
      toValue: e.endCoordinates.height,
      duration: 350,
      easing: Easing.elastic(1),
      friction: 5
    }).start();
  }

  _keyboardWillHide(e) {
    Animated.timing(this.offsetBottom, {
      toValue: 0,
      duration: 350,
      easing: Easing.elastic(1),
      friction: 5
    }).start();
  }

  render() {
    return(
      <Animated.View style={[styles.wrap, { bottom: this.offsetBottom }]}>
        { /* Exit button */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={"transparent"}
          onPress={() => this.props.toggleModal()}>
            <View style={styles.exit}>
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontWeight: '200', color: colors.alertRed }}>
                Cancel
              </Text>
            </View>
        </TouchableHighlight>

        { /* Email input */ }
        <TextInput
          style={[styles.input, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
          placeholderTextColor={colors.white}
          onChangeText={(v) => { if (this.state.errorMessage) this.setState({ errorMessage: null }); this.props.updateEmail(v); }}
          onKeyPress={(e) => { if (e.nativeEvent.key === 'Enter') this.refs.passwordInput.focus(); }}
          placeholder="email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none" autoCorrect={false} autoFocus />

        { /* Password input */ }
        <TextInput
          style={[styles.input, { backgroundColor: 'rgba(0, 0, 0, 0.35)' }]}
          ref="passwordInput"
          placeholderTextColor={colors.white}
          onChangeText={(v) => { if (this.state.errorMessage) this.setState({ errorMessage: null }); this.props.updatePassword(v); }}
          onKeyPress={(e) => { if (e.nativeEvent.key === 'Enter') this.props.onSubmit(); }}
          placeholder="password"
          returnKeyType="go"
          secureTextEntry
          autoCapitalize="none" autoCorrect={false} />

        { /* Submit button */ }
        <AnimatedTouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => (!this.props.loading) ? this.props.onSubmit() : console.log("Already logging in...")}
          style={[styles.submitButton, { backgroundColor: this.submitColor }]}>

          { (this.state.loading)
              ? <Animated.View style={[styles.loading, { opacity: this.loadingOpacity }]}>
                  <Text style={[styles.submitText, { color: colors.richBlack }]}>
                    Loading...
                  </Text>
                </Animated.View>
              : <Text style={styles.submitText}>
                  { (this.state.errorMessage) ? this.state.errorMessage : this.state.submitText }
                </Text> }

        </AnimatedTouchableHighlight>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0, // Overridden by animated value
    left: 0,
    height: 250,
    width: dims.width,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  exit: {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 35,
    paddingBottom: 9,
    overflow: 'visible'
  },
  input: {
    flex: 0.25,
    width: dims.width,
    paddingLeft: 35,
    color: colors.white
  },
  submitButton: {
    flex: 0.25,
    width: dims.width,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '200',
    color: 'white',
    textAlign: 'center'
  },
  loading: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
