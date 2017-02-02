import React from 'react'
import {View, Text, TextInput, TouchableHighlight, Animated, Dimensions, Modal, Image, StyleSheet} from 'react-native'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onFocus() {
    let {onFocus} = this.props
    if (typeof onFocus === 'function') onFocus()
    this.setState({focused: true})
  }

  onBlur() {
    let {onBlur} = this.props
    if (typeof onBlur === 'function') onBlur()
    this.setState({focused: false})
  }

  render() {
    return(
      <View style={styles.wrap}>
        <TextInput
          {...this.props.textInputProps}
          style={styles.textInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.props.onChangeText} />
      </View>
    )
  }
}

const styles = {
  wrap: {
    flex: 1.0, height: 50,
    backgroundColor: colors.snowWhite,
    borderColor: colors.medGrey, borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center'
  },
  textInput: {
    flex: 1.0,
    paddingLeft: 16
  }
}

module.exports = SearchBar
