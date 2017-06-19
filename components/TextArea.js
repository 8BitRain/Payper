import React from 'react'
import {View, StyleSheet, Dimensions, TextInput, Text} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: dims.width,
    marginTop: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingRight: 9,
    paddingLeft: 9,
    borderBottomWidth: 1,
    borderColor: colors.medGrey
  },
  input: {
    color: colors.deepBlue,
    height: dims.height,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 16
  },
  characterCountWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  characterCount: {
    color: colors.slateGrey,
    fontSize: 14
  }
})

class TextArea extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      input: (props.textInputProps) ? props.textInputProps.defaultValue : ""
    }

    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText(input) {
    this.setState({input})

    if (this.props.validateInput)
      this.props.validateInput(input)

    if (this.props.onChangeText)
      this.props.onChangeText(input)
  }

  render() {
    return(
      <View style={[styles.container, this.props.containerStyles || {}]}>

        { /* Edit icon and validity indicator */ }
        <View style={styles.header}>
          {(this.props.insteadOfIcon)
            ? this.props.insteadOfIcon()
            : <EvilIcons {...this.props.iconProps} />}

          <View style={styles.characterCountWrap}>
            <Text style={[styles.characterCount, {color: (this.state.input.length > this.props.characterLimit) ? colors.carminePink : colors.slateGrey}]}>
              {`${this.state.input.length}/${this.props.characterLimit}`}
            </Text>
          </View>
        </View>

        { /* Text Input */ }
        <TextInput style={styles.input} {...this.props.textInputProps} onChangeText={this.onChangeText} />

      </View>
    )
  }
}

module.exports = TextArea
