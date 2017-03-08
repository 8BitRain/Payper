import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, StatusBar, Dimensions, ScrollView, Alert, Animated} from 'react-native'
import {colors} from '../globalStyles'
import {NameField, TextField, DateField, AddressField} from '../components/Inputs'
import {states} from '../helpers/geolocation'
const dims = Dimensions.get('window')

class KYCOnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      verifyButtonOpacity: new Animated.Value(1)
    }

    this.state = {
      loading: false,
      firstName: props.currentUser.first_name,
      lastName: props.currentUser.last_name,
      street: "",
      city: "",
      state: "",
      zip: "",
      dob: "",
      dobDay: "",
      dobMonth: "",
      dobYear: "",
      ssn: ""
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
    let {verifyButtonOpacity} = this.AV
    let fieldIsFocused = this.fieldRefs[title].state.focused

    // Show or hide verify button
    Animated.timing(verifyButtonOpacity, {
      toValue: (fieldIsFocused) ? 0 : 1,
      duration: 200
    }).start()

    // Show or hide input fields
    for (var k of Object.keys(this.fieldRefs)) {
      if (k === title) continue
      let curr = this.fieldRefs[k]

      // Toggle field visiblity
      if (fieldIsFocused) curr.hide()
      else curr.show()
    }
  }

  verify() {
    let {street, city, state, zip, dob, ssn, firstName, lastName} = this.state
    let values = {street, city, state, zip, dob, ssn, firstName, lastName}

    // Check that all input fields have been filled out
    for (var k in values) {
      if (!values[k]) {
        Alert.alert('Wait!', 'Please fill out all fields.')
        return
      }
    }

    // Display loading indicator
    this.setState({loading: true})

    // Format params
    let params = {
      firstName, lastName, city, state, zip, dob, ssn,
      state: (state.length === 2) ? state : states[state],
      address: street
    }

    // Verify
    this.props.currentUser.verify(params, (customerStatus) => {
      this.setState({loading: false})

      if (customerStatus === "verified")
        this.onSuccess()
      else if (customerStatus === "document" || customerStatus === "retry" || customerStatus === "suspended")
        this.onFailure()
      else
        Alert.alert('Sorry...', 'Something went wrong. Please try again later.')
    })
  }

  onSuccess() {
    Actions.VerifiedIdentity()
  }

  onFailure() {
    Actions.pop()
  }

  render() {
    let {
      verifyButtonOpacity
    } = this.AV

    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Fields */ }
        <ScrollView
          ref={ref => this.ScrollView = ref}
          onScroll={(e) => this.setState({scrollTop: e.nativeEvent.contentOffset.y})}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps
          contentContainerStyle={{alignItems: 'center'}}>

          { /* Legal Name */ }
          <NameField
            title={"Legal Name"}
            iconName={"user"}
            complete={false}
            firstNameValue={this.state.firstName}
            lastNameValue={this.state.lastName}
            invalidityAlert={"Please enter a valid name."}
            validateInput={(values) => {
              let isValid = values.firstName && values.lastName && values.firstName.length >= 1 && values.lastName.length >= 1
              return isValid
            }}
            setValue={(values, cb) => {
              this.setState({
                firstName: values.firstName,
                lastName: values.lastName
              }, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Billing Address */ }
          <AddressField
            title={"Billing Address"}
            iconName={"location"}
            complete={false}
            streetValue={this.state.street}
            cityValue={this.state.city}
            stateValue={this.state.state}
            zipValue={this.state.zip}
            invalidityAlert={"Please enter a valid address."}
            textInputProps={{
              autoCapitalize: "words",
              autoCorrect: false
            }}
            validateInput={(input) => {
              return true
            }}
            setValues={(values, cb) => {
              console.log("--> Address values", values)
              this.setState(values, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Date of Birth */ }
          <DateField
            title={"Date of Birth"}
            iconName={"calendar"}
            complete={false}
            dayValue={this.state.dobDay}
            monthValue={this.state.dobMonth}
            yearValue={this.state.dobYear}
            setValues={(values, cb) => {
              let buffer = values.split("-")
              let day = buffer[1]
              let month = buffer[0]
              let year = buffer[2]
              let formattedDOB = year.concat("-").concat(month).concat("-").concat(day)

              this.setState({
                dobDay: day,
                dobMonth: month,
                dobYear: year,
                dob: formattedDOB
              }, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* SSN */ }
          <TextField
            title={"Social Security Number"}
            subtitle={(this.props.retry) ? null : "(Last 4 Digits)"}
            iconName={"lock"}
            complete={false}
            value={this.state.ssn}
            invalidityAlert={"Please enter a valid social security number."}
            textInputProps={{
              placeholder: (this.props.retry) ? "e.g. 123456789" : "e.g. 1234",
              maxLength: (this.props.retry) ? 9 : 4,
              keyboardType: "number-pad"
            }}
            validateInput={(input) => {
              let isValid = input.length === 4
              return true
            }}
            setValue={(value, cb) => {
              this.setState({ssn: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Submit button */ }
          <Animated.View style={{opacity: verifyButtonOpacity}}>
            <TouchableHighlight
              underlayColor={'transparent'}
              onPress={() => (this.state.loading) ? null : this.verify()}>
              <Text style={{textAlign: 'center', width: dims.width * 0.85, marginTop: 15, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.gradientGreen, padding: 14, borderRadius: 4, overflow: 'hidden', zIndex: 0}}>
                {(this.state.loading)
                  ? "Verifying your account..."
                  : "Verify"}
              </Text>
            </TouchableHighlight>
          </Animated.View>

        </ScrollView>
      </View>
    )
  }
}

module.exports = KYCOnboardingView
