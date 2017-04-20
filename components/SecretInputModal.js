import React from 'react'
import {View, Modal, StyleSheet, Dimensions, Alert, TouchableHighlight, Keyboard} from 'react-native'
import {Header, ContinueButton, StickyView} from './'
import {Secret} from '../scenes/BroadcastOnboardingFlow'
import {colors} from '../globalStyles'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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

class SecretInputModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      keyboardIsVisible: true,
      secretInput: props.defaultValue || "",
      inputIsValid: (props.defaultValue) ? true : false
    }
  }

  componentWillMount() {
    this.KeyboardListener = Keyboard.addListener("keyboardWillShow", () => this.setState({keyboardIsVisible: true}))
    this.KeyboardListener = Keyboard.addListener("keyboardWillHide", () => this.setState({keyboardIsVisible: false}))
  }

  componentWillUnmount() {
    this.KeyboardListener = Keyboard.removeListener("keyboardWillShow")
    this.KeyboardListener = Keyboard.removeListener("keyboardWillHide")
  }

  render() {
    return(
      <Modal animationType={"slide"} visible={this.props.visible}>
        <View style={styles.container}>
          <View style={{flex: 0.15}}>
            <Header showTitle title={"Secret"} showBackButton onBack={this.props.cancel} />
          </View>

          <View style={{flex: 0.7}}>
            <Secret state={this.state} induceState={(substate) => this.setState({...substate}, () => console.log(this.state))} />
          </View>

          <View style={{flex: 0.15, width: dims.width, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite, borderTopWidth: 1, borderColor: colors.medGrey}}>
            <ContinueButton onPress={() => (this.state.inputIsValid) ? this.props.onSubmit(this.state.secretInput) : Alert.alert("Invalid Input", "Please enter a valid secret.")} />
          </View>

          { /* Hide keyboard button */ }
          <StickyView>
            {(this.state.keyboardIsVisible)
              ? <TouchableHighlight underlayColor={'transparent'} activeOpacity={0.75} onPress={() => dismissKeyboard()}>
                  <View style={styles.hideKeyboardWrap}>
                    <EvilIcons name={"chevron-down"} color={colors.slateGrey} size={28} />
                  </View>
                </TouchableHighlight>
              : null}
          </StickyView>
        </View>
      </Modal>
    )
  }
}

module.exports = SecretInputModal
