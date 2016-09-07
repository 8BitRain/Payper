// Dependencies
import React from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableHighlight, Modal, Animated } from 'react-native';

// Helper functions
import * as Lambda from '../../services/Lambda';
import * as Validators from '../../helpers/validators';
import * as Alert from '../../helpers/Alert';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Partial components
import ArrowNav from '../../components/Navigation/Arrows/ArrowDouble';

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

// Custom stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create({

  // Title text
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: colors.accent,
    fontWeight: '200',
  },

  // Info text
  info: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.richBlack,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },

  // Text input wrap
  input: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '200',
    color: colors.white,
    paddingLeft: 5,
    paddingRight: 20,
    marginTop: 30,
    width: dimensions.width,
    height: 50,
    backgroundColor: colors.richBlack,
    textAlign: 'left',
  },

  // Display name input
  nameInputWrap: {
    borderBottomWidth: 0.8,
    width: dimensions.width * 0.8,
  },

});


class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.modalProps.title,
      value: this.props.modalProps.value,
      info: this.props.modalProps.info,
      loading: false,
      loadingMessage: "",
      colorOne: new Animated.Value(0),
      colorTwo: new Animated.Value(0),
    };

    this.input = "";
    this.firstNameInput = "";
    this.lastNameInput = "";
    this._clearText = this._clearText.bind(this);
    this._refs = [];
  }


  _animateUnderlineColor(options) {
    if (options.whichColor == "one") Animated.spring(this.state.colorOne, { toValue: options.val }).start();
    else if (options.whichColor == "two") Animated.spring(this.state.colorTwo, { toValue: options.val }).start();
  }


  _handleChangeText(options) {

    console.log("Options:", options);

    if (options.valid) {

      // Set input
      if (options.inputting == "firstName") this.firstNameInput = options.input;
      else if (options.inputting == "lastName") this.lastNameInput = options.input;
      else this.input = options.input;

      // Set underline color
      this._animateUnderlineColor({ whichColor: options.whichColor, val: 500 });

    } else {
      this._animateUnderlineColor({ whichColor: options.whichColor, val: 0 });
    }
  }


  _getPhoneNumberKeyboard() {
    var underlineColor = this.state.colorOne.interpolate({
      inputRange: [0, 500],
      outputRange: ['rgba(255, 255, 255, 1)', 'rgba(33, 191, 85, 1)']
    });

    return(
      <Animated.View style={[styles.nameInputWrap, { borderColor: underlineColor }]}>
        <TextInput
          ref={(component) => this._refs["phone"] = component}
          style={styles.input}
          onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
          onChangeText={(input) => this._handleChangeText({ input: input, valid: Validators.validatePhone(input).valid, whichColor: "one" })}
          autoCorrect={false} autoFocus
          placeholderFontFamily={"Roboto"}
          placeholderTextColor={colors.lightGrey}
          placeholder={"262-305-8038"}
          maxLength={10}
          keyboardType="phone-pad" />
      </Animated.View>
    );
  }


  _getDisplayNameKeyboard() {

    var underlineColorFirstName = this.state.colorOne.interpolate({
      inputRange: [0, 500],
      outputRange: ['rgba(255, 255, 255, 1)', 'rgba(33, 191, 85, 1)']
    });

    var underlineColorLastName = this.state.colorTwo.interpolate({
      inputRange: [0, 500],
      outputRange: ['rgba(255, 255, 255, 1)', 'rgba(33, 191, 85, 1)']
    });

    return(
      <View>
        { /* First name */ }
        <Animated.View style={[styles.nameInputWrap, { borderColor: underlineColorFirstName }]}>
          <TextInput
            ref={(component) => this._refs["firstName"] = component}
            style={[styles.input, { paddingLeft: 10, paddingRight: 10 }]}
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
            placeholderFontFamily={"Roboto"}
            placeholderTextColor={colors.lightGrey}
            placeholder={"First name"}
            autoCorrect={false} autoFocus
            autoCapitalize={"words"}
            onChangeText={(input) => this._handleChangeText({ input: input, valid: Validators.validateName(input).valid, whichColor: "one" })}
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._refs["lastName"].focus() }} />
        </Animated.View>

        { /* Last name */ }
        <Animated.View style={[styles.nameInputWrap, { borderColor: underlineColorLastName }]}>
          <TextInput
            ref={(component) => this._refs["lastName"] = component}
            style={[styles.input, { paddingLeft: 10, paddingRight: 10 }]}
            onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
            placeholderFontFamily={"Roboto"}
            placeholderTextColor={colors.lightGrey}
            placeholder={"Last name"}
            autoCorrect={false}
            autoCapitalize={"words"}
            onChangeText={(input) => this._handleChangeText({ input: input, valid: Validators.validateName(input).valid, whichColor: "two" })} />
        </Animated.View>
      </View>
    );
  }


  _getEmailKeyboard() {
    var underlineColor = this.state.colorOne.interpolate({
      inputRange: [0, 500],
      outputRange: ['rgba(255, 255, 255, 1)', 'rgba(33, 191, 85, 1)']
    });

    return(
      <Animated.View style={[styles.nameInputWrap, { borderColor: underlineColor }]}>
        <TextInput
          ref={(component) => this._refs["email"] = component}
          style={styles.input}
          onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
          placeholderFontFamily={"Roboto"}
          placeholderTextColor={colors.lightGrey}
          placeholder={"Enter your new " + this.state.title.toLowerCase()}
          autoCorrect={false} autoFocus
          autoCapitalize={"none"}
          onChangeText={(input) => this._handleChangeText({ input: input, valid: Validators.validateEmail(input).valid, whichColor: "one" })} />
      </Animated.View>
    );
  }


  _clearText(refs) {
    if (Array.isArray(refs)) for (var r in refs) this._refs[refs[r]].setNativeProps({ text: "" });
    else this._refs[refs].setNativeProps({ text: "" });
  }


  _handleSubmit() {

    // Extend scope
    const _this = this;

    switch (this.props.modalProps.title) {
      case "Display Name":

        var valid = Validators.validateName(this.firstNameInput).valid && Validators.validateName(this.lastNameInput).valid;
        console.log("Valid:", Validators.validateName(this.firstNameInput).valid && Validators.validateName(this.lastNameInput).valid);

        if (valid) {
          // Clear input fields
          this._clearText(["firstName", "lastName"]);

          // Re-focus on first input field
          this._refs["firstName"].focus();

          // Reset input field underline colors
          this._animateUnderlineColor({ whichColor: "one", val: 0 });
          this._animateUnderlineColor({ whichColor: "two", val: 0 });
        } else {
          alert("Not valid!");
        }

      break;
      case "Phone Number":
        var valid = Validators.validatePhone(this.input);
        if (valid.valid) {

          // Activate loading indicator
          this.setState({ loading: true, loadingMessage: "Sending..." });

          // Update user's phone number in Redux user JSON
          var currentUser = this.props.currentUser;
          currentUser.updatedPhone = this.input;

          console.log("Sending user:");
          console.log(currentUser);

          // Hit Lambda with update user object
          Lambda.updateUser({ user: currentUser, token: currentUser.token }, (success) => {
            console.log("Updating phone number was a success:", success);
            if (success) {

              // Clear text input
              this._clearText("phone");

              // Reset underline colors
              this._animateUnderlineColor({ whichColor: "one", val: 0 });

              // Report success and deactive loading indicator
              this.setState({ loadingMessage: "Success!" });
              setTimeout(function() {
                _this.setState({ loading: false, loadingMessage: "" });
              }, 750);

              // Update user's phone number in Redux store
              var currentUser = this.props.currentUser;
              currentUser.decryptedPhone = this.input;
              this.props.setCurrentUser(currentUser);

              // Trigger re-render of options list
              this.props.updateOptionsDataSource();

            } else {

              // Report failure and deactive loading indicator
              this.setState({ loadingMessage: "Failed to update" });
              setTimeout(function() {
                _this.setState({ loading: false, loadingMessages: "" });
              }, 750);

            }
          });
        } else {
          Alert.message({
            title: "Hey!",
            message: "Please enter a valid phone number. (e.g. 2623058038)",
          });
        }
      break;
      case "Email":

        var valid = Validators.validateEmail(this.input);
        console.log("Valid:", valid);

        if (valid.valid) {

          // Activate loading indicator
          this.setState({ loading: true, loadingMessage: "Sending..." });

          // Update user's phone number in Redux user JSON
          var currentUser = this.props.currentUser;
          currentUser.updatedEmail = this.input;

          console.log("Sending user:");
          console.log(currentUser);

          // Hit Lambda with update user object
          Lambda.updateUser({ user: currentUser, token: currentUser.token }, (success) => {
            console.log("Updating email was a success:", success);
            if (success) {

              // Clear text input
              this._clearText("email");

              // Report success and deactive loading indicator
              this.setState({ loadingMessage: "Success!" });
              setTimeout(function() {
                _this.setState({ loading: false, loadingMessage: "" });
              }, 750);

              // Update user's phone number in Redux store
              var currentUser = this.props.currentUser;
              currentUser.decryptedEmail = this.input;
              this.props.setCurrentUser(currentUser);

              // Trigger re-render of options list
              this.props.updateOptionsDataSource();

            } else {

              // Report failure and deactive loading indicator
              this.setState({ loadingMessage: "Failed to update" });
              setTimeout(function() {
                _this.setState({ loading: false, loadingMessages: "" });
              }, 750);

            }
          });
        } else {
          Alert.message({
            title: "Hey!",
            message: "Please enter a valid email. (e.g. johndoe@example.com)",
          });
        }
      break;
    }
  }


  render() {
    return (
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack}}>

        { /* Title */ }
        <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: dimensions.width}}>

          { /* Header */ }
          <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width, backgroundColor: colors.richBlack, padding: 40}}>
            <Text style={styles.title}>
              { this.state.title }
            </Text>
          </View>

          { /* Current value */
            (this.state.value)
              ? <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width}}>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    Current { this.state.title.toLowerCase() + ": " }
                    { /* Bind value directly to user Redux object so it updates in realtime */
                      (this.props.modalProps.title == "Phone Number")
                        ? StringMaster5000.stylizePhoneNumber(this.props.currentUser.decryptedPhone)
                        : (this.props.modalProps.title == "Email")
                          ? this.props.currentUser.decryptedEmail
                          : this.props.modalProps.value }
                  </Text>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    ({this.state.info})
                  </Text>
                </View>
              : <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width}}>
                  <Text style={[styles.info, {color: colors.white, fontWeight: '200'}]}>
                    ({this.state.info})
                  </Text>
                </View> }


          { /* Text input */ }
          <View style={{justifyContent: 'center', alignItems: 'center', width: dimensions.width}}>
            <View >
              { /* Text inputs will differ based on what user is inputting */ }
              { /* (this.props.modalProps.title == "Display Name") ? this._getDisplayNameKeyboard() : null */ }
              { (this.props.modalProps.title == "Phone Number") ? this._getPhoneNumberKeyboard() : null }
              { (this.props.modalProps.title == "Email") ? this._getEmailKeyboard() : null }
            </View>
          </View>

          <View style={{height: 100, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: dimensions.width}}>
          { /* Submit button */
            (this.props.modalProps.title != "Username" && this.props.modalProps.title != "Display Name")
              ? (this.state.loading)
                  ? <Text style={[styles.info, { color: colors.white, fontSize: 20 }]}>
                      { this.state.loadingMessage }
                    </Text>
                  : <ArrowNav
                      arrowNavProps={{left: false, right: true}}
                      callbackRight={() => this._handleSubmit()} />
              : null }
          </View>
        </View>

        { /* Close modal button */ }
        <TouchableHighlight
          underlayColor={'transparent'}
          activeOpacity={0.7}
          onPress={() => this.props.toggleModal()}
          style={{position: 'absolute', top: 0, left: 0, padding: 40, backgroundColor: 'transparent'}}>

          <Entypo name="cross" size={25} color={colors.white} />

        </TouchableHighlight>
      </View>
    );
  }
}

export default Edit;
