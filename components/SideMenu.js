import React from 'react'
import {View, Dimensions} from 'react-native'
import {Actions, DefaultRenderer} from 'react-native-router-flux'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')

class SideMenu extends React.Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.snowWhite}} />
    )
  }
}

module.exports = SideMenu
