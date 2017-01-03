import React from 'react'
import { View, Text, TouchableHighlight, Dimensions, StatusBar, Image, ScrollView, Alert } from "react-native"
import { colors } from '../../globalStyles'
import { TextField } from '../../components'
import { validatePhone, validateEmail } from '../../helpers'
import { Actions } from 'react-native-router-flux'
import * as Lambda from '../../services/Lambda'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

export default class PartialUserOnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      phone: this.props.phone || "",
      email: this.props.email || ""
    }

    this.fieldRefs = {}
    this.induceFieldRef = this.induceFieldRef.bind(this)
    this.toggleFieldFocus = this.toggleFieldFocus.bind(this)
  }

  induceFieldRef(ref) {
    let title = ref.props.title
    this.fieldRefs[title] = ref
  }

  toggleFieldFocus(title, shouldContinueFlow) {
    let fieldIsFocused = this.fieldRefs[title].state.focused

    // Show or hide input fields
    for (var k of Object.keys(this.fieldRefs)) {
      if (k === title) continue
      let curr = this.fieldRefs[k]

      // Toggle field visiblity
      if (fieldIsFocused) curr.hide()
      else curr.show()
    }
  }

  submit() {
    let {phone, email} = this.state
    let {currentUser, isNewUser} = this.props

    // Validate inputs
    if (!phone || !email) {
      Alert.alert("Wait!", "Please fill out all fields.")
      return
    }

    // Update in front end
    currentUser.update({decryptedEmail: email, decryptedPhone: phone})

    // Update in back end
    let params = {updatedPhone: phone, updatedEmail: email}
    Lambda.updateUser({token: currentUser.token, user: params})

    // Go to next view
    if (isNewUser) Actions.FirstPaymentView()
    else Actions.MainViewContainer()
  }

  render() {
    let {phone, email} = this.state

    let info = "Please verify that your contact information is up to date."

    // Overwrite with more detailed info if possible
    if (!phone && !email) info = "We weren't able to retrieve your phone number or email address from Facebook."
    else if (!phone) info = "We weren't able to retrieve your phone number from Facebook."
    else if (!email) info = "We weren't able to retrieve your email address from Facebook."

    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <View style={{overflow: 'hidden'}} onLayout={(e) => this.setState({headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

          <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
              {"Contact Information"}
            </Text>
          </View>
        </View>

        { /* Fields */ }
        <ScrollView
          ref={ref => this.ScrollView = ref}
          onScroll={(e) => this.setState({scrollTop: e.nativeEvent.contentOffset.y})}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps
          contentContainerStyle={{alignItems: 'center'}}>

          { /* Email */ }
          <TextField
            title={"Email Address"}
            iconName={"envelope"}
            complete={false}
            value={this.state.email}
            invalidityAlert={"Please enter a valid email address."}
            textInputProps={{
              placeholder: "e.g. johndoe@ex.co",
              keyboardType: "email-address",
              autoCapitalize: "none",
              autoCorrect: false
            }}
            validateInput={(input) => {
              let isValid = validateEmail(input)
              return isValid
            }}
            setValue={(value, cb) => {
              this.setState({email: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Phone */ }
          <TextField
            title={"Phone Number"}
            iconName={"envelope"}
            complete={false}
            value={this.state.phone}
            invalidityAlert={"Please enter a valid phone number."}
            textInputProps={{
              placeholder: "e.g. 2623058308",
              keyboardType: "number-pad",
              maxLength: 10
            }}
            validateInput={(input) => {
              let isValid = validatePhone(input).isValid
              return isValid
            }}
            setValue={(value, cb) => {
              this.setState({phone: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Info */ }
          <View style={{width: dims.width * 0.9, padding: 8, marginTop: 15, backgroundColor: colors.lightGrey, borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: colors.deepBlue, fontSize: 14, backgroundColor: 'transparent', textAlign: 'center'}}>
              {info}
            </Text>
          </View>
        </ScrollView>

        { /* 'Continue' button */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => { this.setState({input: "Weekly"}, () => this.submit()) }}>
          <View
            style={{
              position: 'absolute', bottom: 36, left: dims.width * 0.075,
              width: dims.width * 0.85, height: 50, backgroundColor: colors.gradientGreen, borderRadius: 4, justifyContent: 'center', alignItems: 'center',
              shadowColor: colors.medGrey, shadowOpacity: 0.75, shadowRadius: 2, shadowOffset: { height: 0, width: 0 }
            }}>
            <Text style={{color: colors.snowWhite, fontSize: 18, textAlign: 'center'}}>
              {"Continue"}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = PartialUserOnboardingView
