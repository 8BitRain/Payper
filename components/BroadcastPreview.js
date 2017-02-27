import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {
  formatBroadcastTimestamp,
  formatFrequency
} from '../helpers/utils'
import {
  JoinButton
} from './'

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

class BroadcastPreview extends React.Component {
  constructor(props) {
    super(props)
    this.timestamp = formatBroadcastTimestamp(props.createdAt)
    this.frequency = formatFrequency(props.frequency)
    this.spotsAvailable = props.memberLimit - props.memberIDs.split(",").length
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => Actions.BroadcastDetails({...this.props})}>
        <View style={styles.container}>

          { /* Title, Frequency, Amount */ }
          <View style={{flex: 0.25, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.icon}>
              <FontAwesome name={"tv"} size={26} color={colors.deepBlue} style={{backgroundColor: 'transparent'}} />
            </View>
          </View>

          { /* Spots Availability */ }
          <View style={{flex: 0.5}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
              {this.props.title}
            </Text>
            <Text style={{color: colors.deepBlue, fontSize: 14, paddingTop: 2}}>
              {`$${this.props.amount} per ${this.frequency}`}
            </Text>
            <Text style={{color: colors.deepBlue, fontSize: 14, paddingTop: 2}}>
              {`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`}
            </Text>
          </View>

          { /* Join Button */ }
          <View style={{flex: 0.25, paddingTop: 10}}>
            <JoinButton onPress={() => alert("Would join...")} />
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

module.exports = BroadcastPreview
