import React from 'react'
import { View, Text, TextInput, TouchableHighlight, Image, Dimensions, StatusBar } from 'react-native'
import { VibrancyView } from 'react-native-blur'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Lambda from '../../services/Lambda'
import StickyView from '../../classes/StickyView'
import { colors } from '../../globalStyles'
import styles from './styles'
const dims = Dimensions.get('window')

class MicrodepositOnboarding extends React.Component {
  constructor(props) {
    super(props)
    this.logoAspectRatio = 377 / 568
    this.state = {
      submitText: "Next",
      amountOne: "",
      amountTwo: "",
      headerHeight: 0
    }
  }

  handleSubmit() {
    let valid = Number.parseFloat(this.state.amountOne) > 0 && Number.parseFloat(this.state.amountTwo) > 0

    if (valid) {
      let params = {
        amount1: Number.parseFloat(this.state.amountOne),
        amount2: Number.parseFloat(this.state.amountTwo),
        token: this.props.currentUser.token
      }

      this.setState({ submitText: "Verifying..." })

      Lambda.verifyMicrodeposits(params, (success) => {
        this.setState({ submitText: (success) ? "Verified!" : "We couldn't verify those amounts. Is there a typo?" })
        if (success) setTimeout(() => this.props.toggleModal(), 750)
      })
    } else {
      this.setState({ submitText: "Enter two valid amounts" })
    }
  }

  handleChangeText(input, whichAmount) {
    let valid = Number.parseFloat(input) > 0 && Number.parseFloat((whichAmount === 1) ? this.state.amountTwo : this.state.amountOne),
        newState = {}

    newState.submitText = (valid) ? "Continue" : "Enter two valid amounts"
    if (whichAmount === 1) newState.amountOne = input
    else newState.amountTwo = input

    this.setState(newState, () => console.log(this.state))
  }

  render() {
    return(
      <View style={styles.wrap}>
        <StatusBar barStyle='light-content' />
        <VibrancyView blurType={"light"} style={styles.blur} />

        { /* Instructions */ }
        <View style={styles.textWrap}>
          <Text style={[styles.text, {width: dims.width - 60}]}>
            { "We made two small deposits to your bank account. Enter the amounts below." }
          </Text>
        </View>

        { /* Inputs */ }
        <View style={styles.inputWrap}>
          <View style={styles.amountWrap}>
            <Text style={styles.text}>
              { "1" }
            </Text>
          </View>

          <TextInput autoFocus
            style={[styles.input, styles.text]}
            placeholderTextColor={colors.slateGrey}
            placeholder={"$0.00"}
            keyboardType={"numeric"}
            onChangeText={(text) => this.handleChangeText(text, 1)} />

          <View style={styles.amountWrap}>
            <Text style={styles.text}>
              { "2" }
            </Text>
          </View>

          <TextInput
            style={[styles.input, styles.text]}
            placeholderTextColor={colors.slateGrey}
            placeholder={"$0.00"}
            keyboardType={"numeric"}
            onChangeText={(text) => this.handleChangeText(text, 2)} />
        </View>

        { /* Submit button */ }
        <StickyView>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.handleSubmit()}>

            <View style={styles.submitWrap}>
              <Text style={{ fontSize: 18, color: colors.snowWhite, textAlign: 'center' }}>
                { this.state.submitText }
              </Text>
            </View>

          </TouchableHighlight>
        </StickyView>
      </View>
    )
  }
}

module.exports = MicrodepositOnboarding
