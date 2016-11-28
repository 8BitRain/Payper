import React from 'react'
import { View, Text, TextInput, TouchableHighlight, Dimensions, Image, StatusBar } from 'react-native'
import { colors } from '../../globalStyles'
import { sendPasswordResetEmail } from '../../auth'
import { StickyView } from '../../components'
import * as Validate from '../../helpers/Validate'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class PasswordReset extends React.Component {
  constructor(props) {
    super(props)

    this.errorMessages = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-not-found": "We couldn't find a user with that email address. Is there a typo?"
    }

    this.state = {
      email: "",
      submittable: true
    }
  }

  onChangeText(input) {
    this.setState({email: input})
  }

  onKeyPress(e) {
    if (e.nativeEvent.key === "Enter") this.submit()
  }

  submit() {
    let { email, submittable } = this.state
    if (!submittable) return

    let isValid = Validate.email(email)

    if (isValid) {
      this.setState({submittable: false})

      sendPasswordResetEmail(email, (err) => {
        if (err) {
          alert(this.errorMessages[err.code])
          this.setState({submittable: true})
        } else {
          this.props.close()
        }
      })
    } else {
      let msg = (email.length > 0) ? email + " is not a valid email address." : "Please enter a valid email address."
      alert(msg)
    }
  }

  render() {
    let { close } = this.props

    return(
      <View style={{flex: 1.0}}>
        <StatusBar barStyle='light-content' />

        { /* Header */ }
        <View style={{overflow: 'hidden'}}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
          <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
              {"Password Reset"}
            </Text>

            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
              onPress={() => close()}>
              <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Inner content */ }
        <View style={{flex: 1.0, backgroundColor: colors.snowWhite, alignItems: 'center', paddingTop: 35}}>
          <Text style={{fontSize: 20, color: colors.deepBlue, textAlign: 'center', width: dims.width - 40, paddingBottom: 5}}>
            {"What's your email address?"}
          </Text>

          <EvilIcons name={"envelope"} size={42} color={colors.accent} style={{padding: 3}} />

          <Text style={{fontSize: 18, color: colors.deepBlue, textAlign: 'center', width: dims.width - 40}}>
            {"We'll send you a password reset link."}
          </Text>

          { /* Input and submit button */ }
          <StickyView>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, overflow: 'hidden'}}>
              <TextInput
                autoFocus autoCapitalize={"none"} autoCorrect={false}
                placeholder={"e.g. info@getpayper.io"}
                placeholderTextColor={colors.slateGrey}
                keyboardType={"email-address"}
                style={{flex: 1.0, width: dims.width * 0.85, backgroundColor: colors.medGrey, textAlign: 'left', paddingLeft: 20}}
                onChangeText={this.onChangeText.bind(this)}
                onKeyPress={this.onKeyPress.bind(this)} />

              <TouchableHighlight activeOpacity={0.8} underlayColor={'transparent'} onPress={() => this.submit()}>
                <View style={{flex: 1.0, width: dims.width * 0.15, backgroundColor: colors.gradientGreen, justifyContent: 'center', alignItems: 'center'}}>
                  <EvilIcons name={"chevron-right"} size={32} color={colors.snowWhite} />
                </View>
              </TouchableHighlight>
            </View>
          </StickyView>
        </View>
      </View>
    )
  }
}

module.exports = PasswordReset
