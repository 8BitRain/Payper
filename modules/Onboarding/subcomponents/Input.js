import React from 'react'
import { View, TouchableHighlight, Text, Dimensions } from 'react-native'
import { colors } from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class Input extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {iconName, title, onPress, complete} = this.props

    return(
      <View style={{flex: 1.0, flexDirection: column, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.alertRed}}>

      </View>
    )
  }
}

module.exports = Input
