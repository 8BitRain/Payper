import React from 'react'
import {View, StyleSheet, Text} from 'react-native'
import {TextArea} from '../../components'
import {colors} from '../../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})

class Secret extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      secretInput: "",
      inputIsValid: false
    }

    this.onChangeText = this.onChangeText.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  onChangeText(input) {
    this.setState({secretInput: input}, () => this.props.induceState(this.state, this.props.title))
  }

  validateInput(input) {
    let inputIsValid = input.length > 0 && input.length < 141
    this.setState({inputIsValid})
  }

  render() {
    return(
      <View style={styles.container}>

        <TextArea
          validateInput={this.validateInput}
          onChangeText={this.onChangeText}
          inputIsValid={this.state.inputIsValid}
          characterLimit={300}
          textInputProps={{
            multiline: true,
            autoCorrect: false,
            autoFocus: true,
            defaultValue: (this.props.currentSecret) ? this.props.currentSecret.decryptedSecret : this.state.secretInput,
            placeholder: "This message is only visible to cast members. Put any info required to complete your transaction here.",
            placeholderTextColor: colors.slateGrey
          }}
          iconProps={{
            name: "lock",
            color: colors.accent,
            size: 30
          }} />

      </View>
    )
  }
}

module.exports = Secret
