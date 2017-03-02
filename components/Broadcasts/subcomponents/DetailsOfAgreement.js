import React from 'react'
import {View, Text} from 'react-native'
import {colors} from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class DetailsOfAgreement extends React.Component {
  render() {
    return(
      <View style={{paddingTop: 15, paddingBottom: 15, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: 1}}>
        <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
          {"Details of Agreement"}
        </Text>
        <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2}}>
          {this.props.broadcast.detailsOfAgreement}
        </Text>
      </View>
    )
  }
}

module.exports = DetailsOfAgreement
