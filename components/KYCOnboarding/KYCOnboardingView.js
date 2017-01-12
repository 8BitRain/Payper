import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight, StatusBar, Dimensions, ScrollView, Alert, Animated} from 'react-native'
import {colors} from '../../globalStyles'
import {NameField, TextField, DateField, AddressField} from '../../components'
import {ListOfStates} from '../../helpers'
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

  testVerify() {
    let testParams = {
      firstName: "Test",
      lastName: "Guy",
      address: "1001 University Ave",
      city: "Madison",
      state: "WI",
      zip: "53715",
      dob: "1997-06-02",
      ssn: "1234"
    }

    this.props.currentUser.verify(testParams, () => null)
  }

  verify() {
    console.log("--> verify() was invoked...")
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
      state: ListOfStates[state],
      address: street
    }

    // Verify
    this.props.currentUser.verify(params, (success) => {
      console.log("--> verify() callback was invoked. success?", success)

      if (success) {
        this.setState({loading: false})
        alert("Success!")
      } else {
        Alert.alert('Sorry...', 'Something went wrong. Please try again later.')
      }
    })
  }

  render() {
    let {
      verifyButtonOpacity
    } = this.AV

    if (true) {
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

                this.setState({
                  dobDay: day,
                  dobMonth: month,
                  dobYear: year,
                  dob: values
                }, () => cb())
              }}
              induceFieldRef={this.induceFieldRef}
              toggleFieldFocus={this.toggleFieldFocus} />

            { /* SSN */ }
            <TextField
              title={"Social Security Number"}
              iconName={"lock"}
              complete={false}
              value={this.state.ssn}
              invalidityAlert={"Please enter a valid social security number."}
              textInputProps={{
                placeholder: "e.g. 1234",
                maxLength: 4,
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
                onPress={() => (this.state.loading) ? null : this.testVerify()}>
                <Text style={{textAlign: 'center', width: dims.width * 0.85, marginTop: 15, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.gradientGreen, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
                  {(this.state.loading)
                    ? "Verifying your account..."
                    : "Verify"}
                </Text>
              </TouchableHighlight>
            </Animated.View>

          </ScrollView>
        </View>
      )
    } else {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite}}>
          <StatusBar barStyle={"default"} />

          <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.carminePink, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
            {"KYCOnboardingView.js"}
          </Text>

          <Text style={{width: dims.width * 0.85, margin: 5, fontSize: 14, color: colors.deepBlue, backgroundColor: colors.lightGrey, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
            {"This view onboards all info required by Dwolla's White Label Guide for KYC verification. It should be made clear to the user that this process is optional (advantages of verification should be explained), and that the process will strengthen the security of the user's sensitive information."}
          </Text>

          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => this.testVerify()}>
            <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.gradientGreen, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
              {"Test Verification"}
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => Actions.pop()}>
            <Text style={{textAlign: 'center', width: dims.width * 0.85, margin: 5, fontSize: 16, color: colors.snowWhite, backgroundColor: colors.accent, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
              {"Back"}
            </Text>
          </TouchableHighlight>
        </View>
      )
    }
  }
}

module.exports = KYCOnboardingView
