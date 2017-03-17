import React from 'react'
import {View, Text} from 'react-native'
import {colors} from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class Secret extends React.Component {
  render() {
    return(
      <View style={{paddingTop: 8, paddingBottom: 15, width: this.props.width, borderColor: colors.medGrey, borderBottomWidth: 1}}>

        { /* Title and Lock Icon */ }
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
            {"Secret"}
          </Text>
          <EvilIcons name={(this.props.hide) ? "lock" : "unlock"} size={32} color={colors.accent} />
        </View>

        { /* Text */ }
        <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, alignItems: 'center', flexWrap: 'wrap'}}>
          {(this.props.hide)
            ? "Unlocks upon subscription."
            : this.props.broadcast.secret}
        </Text>

      </View>
    )
  }
}

module.exports = Secret
