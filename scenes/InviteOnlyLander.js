import React from 'react'
import {View, Text, StyleSheet, Dimensions, TextInput, Keyboard, TouchableHighlight, Alert, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {ContinueButton, StickyView} from '../components'
import {setInAsyncStorage} from '../helpers/asyncStorage'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width
  },
  logo: {
    width: dims.width * 0.28,
    height: dims.width * 0.28,
    borderRadius: 6
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dims.width * 0.8,
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
  hideKeyboardWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderColor: colors.medGrey,
    backgroundColor: colors.snowWhite,
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
})

class InviteOnlyLander extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      input: ""
    }

    this.submit = this.submit.bind(this)
  }

  grantAccess() {
    setInAsyncStorage('hasAccess', 'yes')
  }

  revokeAccess() {
    setInAsyncStorage('hasAccess', '')
  }

  submit() {
    if (this.state.input.length !== 10) {
      Alert.alert("Invalid Input", "Please enter a valid phone number.")
      return
    }

    // TODO: Hit API
    this.grantAccess()
    Actions.Lander()
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Background image */ }
        <Image source={require('./../assets/images/lander-background.jpg')} style={styles.backgroundImage} />

        <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>

          { /* Logo */ }
          <Image source={require('./../assets/images/app-icon.png')} style={styles.logo} />

          { /* Filler */ }
          <View style={{height: 35}} />

          { /* Phone input */ }
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Text style={{fontSize: 16, color: colors.accent}}>
                {"1+"}
              </Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              autoFocus
              maxLength={10}
              keyboardType={"phone-pad"}
              placeholder={"Phone Number"}
              placeholderTextColor={colors.slateGrey}
              style={styles.input}
              onChangeText={(input) => this.setState({input})} />
          </View>
        </View>

        { /* Filler */ }
        <View style={{flex: 0.4}} />

        { /* Submit button */ }
        <StickyView>
          <View style={{alignItems: 'center', paddingBottom: 20}}>
            <ContinueButton onPress={this.submit} containerStyles={{shadowColor: colors.slateGrey}} />
          </View>
        </StickyView>
      </View>
    )
  }
}

module.exports = InviteOnlyLander
