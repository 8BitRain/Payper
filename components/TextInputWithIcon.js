import React from 'react'
import {View, StyleSheet, Dimensions, TextInput} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    marginTop: 10,
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
    flex: 0.72,
    height: 44
  },
  validityIndicatorWrap: {
    flex: 0.14,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class TextInputWithIcon extends React.Component {
  constructor(props) {
    super(props)

    if (typeof props.textInputProps !== 'object')
      throw "TextInputWithIcon expected 'textInputProps' JSON prop."
    if (typeof props.iconProps !== 'object' && !props.insteadOfIcon)
      throw "TextInputWithIcon expected 'iconProps' JSON prop."

    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText(input) {
    if (this.props.validateInput)
      this.props.validateInput(input)

    if (this.props.onChangeText)
      this.props.onChangeText(input)
  }

  render() {
    return(
      <View style={[styles.inputWrap, {width: this.props.width || dims.width * 0.9}]}>

        { /* Icon */ }
        <View style={styles.iconWrap}>
          {
            (this.props.insteadOfIcon)
              ? this.props.insteadOfIcon()
              : <EvilIcons {...this.props.iconProps} />
          }
        </View>

        <View style={styles.divider} />

        { /* Text Input */ }
        <TextInput style={styles.input} {...this.props.textInputProps} onChangeText={this.onChangeText} />

        { /* Validity Indicator */ }
        <View style={styles.validityIndicatorWrap}>
          <EvilIcons name={"check"} size={30} color={(this.props.inputIsValid) ? colors.gradientGreen : colors.slateGrey} />
        </View>

      </View>
    )
  }
}

module.exports = TextInputWithIcon
