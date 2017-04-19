import React from 'react'
import {View, Modal, StyleSheet, Dimensions, Alert} from 'react-native'
import {Header, ContinueButton} from './'
import {Secret} from '../scenes/BroadcastOnboardingFlow'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class SecretInputModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      secretInput: props.defaultValue || "",
      inputIsValid: (props.defaultValue) ? true : false
    }
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
        </View>
      </Modal>
    )
  }
}

module.exports = SecretInputModal
