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

class DetailsOfAgreement extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      doaInput: "",
      inputIsValid: false
    }

    this.onChangeText = this.onChangeText.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  onChangeText(input) {
    this.setState({doaInput: input}, () => this.props.induceState(this.state, this.props.title))
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
          textInputProps={{
            multiline: true,
            autoCorrect: false,
            autoFocus: true,
            defaultValue: this.state.doaInput,
            placeholder: "Prospective cast members must agree to your Details of Agreement before joining.",
            placeholderTextColor: colors.slateGrey
          }}
          iconProps={{
            name: "pencil",
            color: colors.accent,
            size: 30
          }} />

      </View>
    )
  }
}

module.exports = DetailsOfAgreement
