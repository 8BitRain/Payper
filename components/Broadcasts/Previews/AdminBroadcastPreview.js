import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {
  formatBroadcastTimestamp,
  formatFrequency
} from '../../../helpers/utils'
import {
  subscribe
} from '../../../helpers/broadcasts'
import {
  JoinButton
} from '../'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.medGrey,
    borderBottomWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 0,
    paddingRight: 10
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 47,
    height: 47,
    borderRadius: 23.5,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

class AdminBroadcastPreview extends React.Component {
  constructor(props) {
    super(props)
    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.memberIDs) ? 0 : props.broadcast.memberIDs.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => Actions.AdminBroadcast({...this.props})}>
        <View style={styles.container}>

          { /* Title, Frequency, Amount */ }
          <View style={{flex: 0.25, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.icon}>
              <FontAwesome name={"tv"} size={26} color={colors.deepBlue} style={{backgroundColor: 'transparent'}} />
            </View>
          </View>

          { /* Spots Availability */ }
          <View style={{flex: 0.6}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
              {this.props.broadcast.title}
            </Text>
            <Text style={{color: colors.deepBlue, fontSize: 14, paddingTop: 2}}>
              {`$${this.props.broadcast.amount} per ${this.frequency}`}
            </Text>
            <Text style={{color: colors.deepBlue, fontSize: 14, paddingTop: 2}}>
              {`${this.spotsFilled} of ${this.props.broadcast.memberLimit} spots filled`}
            </Text>
          </View>

          { /* Chevron connoting pressability */ }
          <View style={{flex: 0.15, alignItems: 'flex-end', paddingTop: 10}}>
            <EvilIcons name={"chevron-right"} size={32} color={colors.slateGrey} />
          </View>

          { /* Timestamp */ }
          <View style={{position: 'absolute', top: 6, right: 10}}>
            <Text style={{fontSize: 12, color: colors.slateGrey}}>
              {this.timestamp}
            </Text>
          </View>

        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = AdminBroadcastPreview
