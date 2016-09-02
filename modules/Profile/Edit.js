// Dependencies
import React from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableHighlight, Modal } from 'react-native';

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
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 30,
    width: dimensions.width,
    height: 50,
    backgroundColor: colors.richBlack,
    textAlign: 'center',
  },

});


class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.modalProps.title,
      value: this.props.modalProps.value,
      info: this.props.modalProps.info,
    };

    this.input = "";
  }


  _getPhoneNumberKeyboard() {
    return(
      <TextInput
        style={styles.input}
        onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
        onChangeText={(input) => { this.input = input; }}
        autoCorrect={false} autoFocus
        placeholderFontFamily="Roboto"
        placeholderTextColor={colors.lightGrey}
        placeholder={"262-305-8038"}
        maxLength={10}
        keyboardType="phone-pad" />
    );
  }


  _getDisplayNameKeyboard() {
    return(
      <TextInput
        style={styles.input}
        onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
        placeholderFontFamily={"Roboto"}
        placeholderTextColor={colors.lightGrey}
        placeholder={"Enter your new " + this.state.title.toLowerCase()}
        autoCorrect={false} autoFocus
        autoCapitalize={"words"}
        onChangeText={(input) => { this.input = input }} />
    );
  }


  _getEmailKeyboard() {
    return(
      <TextInput
        style={styles.input}
        onKeyPress={(e) => { if (e.nativeEvent.key == "Enter") this._handleSubmit(); }}
        placeholderFontFamily={"Roboto"}
        placeholderTextColor={colors.lightGrey}
        placeholder={"Enter your new " + this.state.title.toLowerCase()}
        autoCorrect={false} autoFocus
        autoCapitalize={"none"}
        onChangeText={(input) => { this.input = input }} />
    );
  }


  _handleSubmit() {

    // Extend scope
    const _this = this;
    var valid;

    switch (this.props.modalProps.title) {
      case "Display Name":
        valid = Validators.validateName(this.input);
        console.log("Valid:", valid);
      break;
      case "Phone Number":
        valid = Validators.validatePhone(this.input);
        if (valid.valid) {
          Lambda.updatePhone({ phone: this.input, token: this.props.currentUser.token }, (success) => {
            console.log("Updating phone number was a success:", success);
            if (success) {
              var currentUser = this.props.currentUser;
              currentUser.decryptedPhone = this.input;
              this.props.setCurrentUser(currentUser);
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
        valid = Validators.validateEmail(this.input);
        console.log("Valid:", valid);
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
                    Current { this.state.title.toLowerCase() }: { (this.props.modalProps.title == "Phone Number") ? StringMaster5000.stylizePhoneNumber(this.state.value) : this.state.value }
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
              { (this.props.modalProps.title == "Display Name") ? this._getDisplayNameKeyboard() : null }
              { (this.props.modalProps.title == "Phone Number") ? this._getPhoneNumberKeyboard() : null }
              { (this.props.modalProps.title == "Email") ? this._getEmailKeyboard() : null }
            </View>
          </View>

          { /* Submit button */
            (this.props.modalProps.title != "Username")
              ? <ArrowNav
                  arrowNavProps={{left: false, right: true}}
                  callbackRight={() => this._handleSubmit()} />
              : null }

        </View>

        { /* Close modal button */ }
        <TouchableHighlight
          underlayColor={'transparent'}
          activeOpacity={0.7}
          onPress={() => this.props.toggleModal()}
          style={{position: 'absolute', top: 0, left: 0, padding: 40, backgroundColor: 'transparent'}}>

          <Entypo name="cross" size={25} color={colors.accent} />

        </TouchableHighlight>

      </View>
    );
  }
}

export default Edit;
