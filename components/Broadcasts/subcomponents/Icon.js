import React from 'react'
import {View} from 'react-native'
import {colors} from '../../../globalStyles'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class Icon extends React.Component {
  render() {
    return(
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: this.props.width || 47,
        height: this.props.height || 47,
        borderRadius: this.props.width / 2 || 23.5,
        backgroundColor: colors.snowWhite,
        shadowColor: colors.medGrey,
        shadowOpacity: 1.0,
        shadowRadius: 2,
        shadowOffset: {
          height: 0,
          width: 0
        }
      }}>
        <FontAwesome name={"tv"} size={this.props.size || 26} color={colors.deepBlue} style={{backgroundColor: 'transparent'}} />
      </View>
    )
  }
}

module.exports = Icon
