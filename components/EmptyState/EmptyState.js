import React from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {
  View, TouchableHighlight, Dimensions, Text
} from 'react-native'
import {
  Actions
} from 'react-native-router-flux'
import {
  colors
} from '../../globalStyles'

const dims = Dimensions.get('window')

class EmptyState extends React.Component {
  render() {
    return(
      <View style={{
        width: dims.width * 0.94,
        marginLeft: dims.width * 0.03,
        marginTop: 10,
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        shadowColor: colors.medGrey,
        shadowOpacity: 1.0,
        shadowRadius: 1,
        shadowOffset: {
          height: 0.25,
          width: 0.25
        }
      }}>
        { /* Top half (info) */ }
        <View style={{
          flex: 1.0, justifyContent: 'center', alignItems: 'center',
          paddingTop: 16, paddingBottom: 16,
          paddingLeft: 5, paddingRight: 5,
          backgroundColor: colors.snowWhite
        }}>
          <Text style={{fontSize: 16, color: colors.deepBlue, textAlign: 'center'}}>
            {"Press the (+) at the bottom right of your screen to set up a payment series!"}
          </Text>
        </View>
      </View>
    )
  }
}

module.exports = EmptyState
