import React from 'react'
import {View, Text, StyleSheet, TextInput, TouchableHighlight, Platform, Dimensions, StatusBar, ScrollView, Alert} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {Header} from '../components'
import {validateEmail, validatePhone} from '../helpers/validators'
import {login} from '../helpers/auth'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  headerWrap: {
    padding: 12,
    paddingTop: (Platform.OS === 'ios') ? 32 : 12,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.accent
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dims.width * 0.9,
    backgroundColor: colors.lightGrey,
    marginTop: 14,
    height: 44,
    borderRadius: 4
  },
  iconWrap: {
    flex: 0.14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    height: 26,
    width: 1,
    backgroundColor: colors.medGrey
  },
  input: {
    color: colors.deepBlue,
    paddingLeft: 8,
    flex: 0.86,
    height: 44
  },
  moreInfo: {
    width: dims.width * 0.9,
    marginTop: 10,
    padding: 4,
    fontSize: 16,
    color: colors.slateGrey,
    textAlign: 'left'
  },
  continueButton: {
    position: 'absolute',
    bottom: 36,
    left: dims.width * 0.075,
    width: dims.width * 0.85,
    height: 50,
    backgroundColor: colors.gradientGreen,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.medGrey,
    shadowOpacity: 0.75,
    shadowRadius: 2,
    shadowOffset: {height: 0, width: 0}
  },
  continueButtonText: {
    color: colors.snowWhite,
    fontSize: 18,
    textAlign: 'center'
  }
})

class FacebookLoginModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: props.userData,
      submitting: false,
      info: "",
      emailIsValid: validateEmail(props.userData.email),
      phoneIsValid: validatePhone(props.userData.phone)
    }
  }

  updateEmail(input) {
    this.state.userData.email = input
    this.state.emailIsValid = validateEmail(input)
    this.setState(this.state)
  }

  updatePhone(input) {
    this.state.userData.phone = input
    this.state.phoneIsValid = validatePhone(input)
    if (this.state.phoneIsValid) this.refs.phoneInput.blur()
    this.setState(this.state)
  }

  submit() {
    if (this.state.submitting) return

    if (!this.state.emailIsValid) {
      Alert.alert('Invalid Email Address', 'Please enter a valid email address (ex. johndoe@example.com).')
      return
    }

    if (!this.state.phoneIsValid) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number (ex. 1+ 2623058038).')
      return
    }

    this.setState({submitting: true})

    login({
      mode: "facebook",
      facebookUser: this.state.userData,
      onSuccess: (firebaseUserData) => console.log(firebaseUserData),
      onFailure: (err) => console.log("Error:", err)
    })

    setTimeout(() => this.setState({submitting: false}), 1200)
  }

  render() {
    let {userData, phone, email, submitting, error} = this.state
    let info = "Please verify that your contact information is up to date."
    if (!phone && !email) info = "We weren't able to retrieve your phone number or email address from Facebook."
    else if (!phone) info = "We weren't able to retrieve your phone number from Facebook."
    else if (!email) info = "We weren't able to retrieve your email address from Facebook."

    return(
      <View style={{flex: 1.0, flexDirection: 'column', backgroundColor: colors.snowWhite}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <Header title={"Sign Up Confirmation"} showTitle />

        <ScrollView
          ref={ref => this.ScrollView = ref}
          scrollEventThrottle={16}
          contentContainerStyle={{alignItems: 'center'}}>
          { /* Welcome message and info message */ }
          <View style={{width: dims.width * 0.9, padding: 12, marginTop: 12, backgroundColor: colors.lightGrey, borderRadius: 4, justifyContent: 'center'}}>
            <Text style={{color: colors.deepBlue, fontSize: 20, padding: 4, backgroundColor: 'transparent', textAlign: 'left'}}>
              {`Hey ${userData.first_name},`}
            </Text>
            <Text style={{color: colors.deepBlue, fontSize: 14, padding: 4, backgroundColor: 'transparent', textAlign: 'left'}}>
              {info}
            </Text>
          </View>

          { /* Email input */ }
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <EvilIcons name={"envelope"} size={32} color={colors.accent} />
            </View>
            <View style={styles.divider} />
            <TextInput
              ref={"emailInput"}
              autoCorrect={false}
              keyboardType={"email-address"}
              defaultValue={userData.email || ""}
              placeholder={"Email Address"}
              placeholderTextColor={colors.slateGrey}
              style={styles.input}
              onChangeText={(text) => this.updateEmail(text)} />
          </View>

          { /* Phone input */ }
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Text style={{fontSize: 16, color: colors.accent}}>
                {"1+"}
              </Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              ref={"phoneInput"}
              autoCorrect={false}
              keyboardType={"number-pad"}
              maxLength={10}
              defaultValue={userData.phone || ""}
              placeholder={"Phone Number"}
              placeholderTextColor={colors.slateGrey}
              returnKeyType={"done"}
              style={styles.input}
              onSubmitEditing={() => this.submit()}
              onChangeText={(text) => this.updatePhone(text)} />
          </View>

          <Text style={styles.moreInfo}>
            {"We won't share your phone number or email address with anyone else."}
          </Text>
        </ScrollView>

        { /* 'Continue' button */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => this.submit()}>
          <View style={styles.continueButton}>
            <Text style={styles.continueButtonText}>
              {(submitting) ? "Just a second..." : "Continue"}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = FacebookLoginModal
