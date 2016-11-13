import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { colors } from '../../globalStyles'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class SideMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
        <VibrancyView blurType="dark" style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
      </View>
    )
  }
}

module.exports = SideMenu
