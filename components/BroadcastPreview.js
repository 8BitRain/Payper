import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {
  formatBroadcastTimestamp,
  formatFrequency
} from '../helpers/strings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderColor: colors.medGrey,
    borderBottomWidth: 1
  },
  left: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    flex: 0.6,
    paddingLeft: 14
  },
  right: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lightGrey,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  title: {
    fontSize: 18,
    color: colors.deepBlue
  },
  username: {
    fontSize: 15,
    color: colors.accent
  },
  spots: {
    fontSize: 15,
    color: colors.deepBlue
  },
  timestamp: {
    fontSize: 12,
    color: colors.slateGrey
  },
  amount: {
    fontSize: 18,
    color: colors.gradientGreen
  },
  frequency: {
    fontSize: 15,
    color: colors.deepBlue
  }
})

class BroadcastPreview extends React.Component {
  constructor(props) {
    super(props)
    this.timestamp = formatBroadcastTimestamp(this.props.createdAt)
    this.frequency = formatFrequency(this.props.frequency)
    this.spotsAvailable = props.memberLimit - props.memberIDs.split(",").length
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => Actions.BroadcastDetails({...this.props})}>
        <View style={styles.container}>
          <View style={styles.left}>
            <View style={styles.icon} />
          </View>
          <View style={styles.center}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.username}>{this.props.caster.username}</Text>
            <Text style={styles.spots}>{`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.timestamp}>{this.timestamp}</Text>
            <Text style={styles.amount}>{`$${this.props.amount}`}</Text>
            <Text style={styles.frequency}>{`${this.props.frequency.charAt(0).concat(this.props.frequency.toLowerCase().substring(1, this.props.frequency.length))}`}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = BroadcastPreview
