import React from 'react'
import {View, StyleSheet, Text, Animated} from 'react-native'
import {TextArea} from '../../components'
import {colors} from '../../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})

class Terms extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      termsWrap: {
        height: new Animated.Value(200),
        opacity: new Animated.Value(1)
      },
      hiddenTermsWrap: {
        height: new Animated.Value(200),
        opacity: new Animated.Value(1)
      }
    }

    this.state = props.state || {
      doaInput: "",
      hiddenTermsInput: "",
      inputIsValid: false
    }

    this.validateInput = this.validateInput.bind(this)
  }

  validateInput(input) {
    let inputIsValid = input.length > 0 && input.length < 141
    this.setState({inputIsValid})
  }

  hide(input) {
    let inputToHide = ("terms" === input) ? this.AV.termsWrap : this.AV.hiddenTermsWrap

    let animations = [
      Animated.timing(inputToHide.height, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(inputToHide.opacity, {
        toValue: 0,
        duration: 200
      })
    ]

    Animated.parallel(animations).start()
  }

  show(input) {
    let values = ("terms" === input) ? this.AV.termsWrap : this.AV.hiddenTermsWrap

    let animations = [
      Animated.timing(values.height, {
        toValue: 200,
        duration: 200
      }),
      Animated.timing(values.opacity, {
        toValue: 1,
        duration: 200
      })
    ]

    Animated.parallel(animations).start()
  }

  render() {
    return(
      <View style={styles.container}>
        <Animated.View style={this.AV.termsWrap}>
          <TextArea
            validateInput={this.validateInput}
            onChangeText={(input) => this.setState({doaInput: input}, () => this.props.induceState(this.state, this.props.title))}
            inputIsValid={this.state.inputIsValid}
            textInputProps={{
              multiline: true,
              autoCorrect: false,
              autoFocus: false,
              defaultValue: this.state.doaInput,
              placeholder: "Users must agree to your Terms of Agreement before subscribing.",
              placeholderTextColor: colors.slateGrey,
              onFocus: () => this.hide("hiddenTerms"),
              onBlur: () => this.show("hiddenTerms")
            }}
            iconProps={{
              name: "pencil",
              color: colors.accent,
              size: 30
            }} />
        </Animated.View>

        <Animated.View style={this.AV.hiddenTermsWrap}>
          <TextArea
            validateInput={this.validateInput}
            onChangeText={(input) => this.setState({hiddenTermsInput: input}, () => this.props.induceState(this.state, this.props.title))}
            inputIsValid={this.state.inputIsValid}
            containerStyles={{borderTopWidth: 1, borderColor: colors.medGrey}}
            textInputProps={{
              multiline: true,
              autoCorrect: false,
              autoFocus: false,
              defaultValue: this.state.hiddenTermsInput,
              placeholder: "Only subscribers are able to see your hidden terms.",
              placeholderTextColor: colors.slateGrey,
              onFocus: () => this.hide("terms"),
              onBlur: () => this.show("terms")
            }}
            iconProps={{
              name: "lock",
              color: colors.accent,
              size: 30
            }} />
        </Animated.View>
      </View>
    )
  }
}

module.exports = Terms
