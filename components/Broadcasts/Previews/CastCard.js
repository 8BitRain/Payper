import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, Text, StyleSheet, TouchableHighlight, Dimensions, Image} from 'react-native'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: dims.width * 0.94,
    marginTop: 10,
    backgroundColor: colors.snowWhite,
    borderRadius: 4,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0.25,
      width: 0.25
    }
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.medGrey
  },
  initials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.medGrey,
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 14
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14
  }
})

class CastCard extends React.Component {
  constructor(props) {
    super(props)
    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.memberIDs) ? 0 : props.broadcast.memberIDs.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled
  }

  render() {
    return(
      <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={() => null}>
        <View style={styles.container}>

          { /* Top */ }
          <View style={styles.top}>

            { /* Profile Picutre or Initials */ }
            <View style={{alignSelf: 'flex-start'}}>
              {(this.props.broadcast.caster.profilePic && this.props.broadcast.caster.profilePic.indexOf('http') >= 0)
                ? <Image style={styles.profilePic} source={{uri: this.props.broadcast.caster.profilePic}} />
                : <View style={styles.initials}>
                    <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                      {`${this.props.broadcast.caster.firstName.charAt(0)}${this.props.broadcast.caster.lastName.charAt(0)}`}
                    </Text>
                </View> }
            </View>

            { /* Cast Title and Caster Username */ }
            <View style={{alignSelf: 'flex-start', marginLeft: -18}}>
              <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '400'}}>
                {this.props.broadcast.title}
              </Text>
              <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '400'}}>
                {this.props.broadcast.caster.username}
              </Text>
            </View>

            { /* Timestamp */ }
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{fontSize: 12, color: colors.slateGrey}}>
                {this.timestamp}
              </Text>
            </View>
          </View>

          { /* Bottom */ }
          <View style={styles.bottom}>

            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{color: colors.gradientGreen, fontSize: 12, alignSelf: 'flex-start'}}>
                {`$`}
              </Text>
              <Text style={{color: colors.gradientGreen, fontSize: 20}}>
                {this.props.broadcast.amount}
              </Text>
              <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, }}>
                {` per ${this.frequency}`}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, }}>
                {`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available.`}
              </Text>
            </View>
          </View>

        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = CastCard
