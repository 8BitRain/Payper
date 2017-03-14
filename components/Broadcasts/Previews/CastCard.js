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
    borderRadius: 4,
    marginTop: 10,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  profilePic: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.medGrey
  },
  initials: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.medGrey,
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 4
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    padding: 6,
    paddingLeft: 12,
    paddingTop: 4,
    justifyContent: 'space-between',
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6
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

          { /* Chevron (absolutely positioned) */ }
          <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 6, paddingTop: 14}}>
            <EvilIcons name={"chevron-right"} color={colors.slateGrey} size={32} />
          </View>

          { /* Timestamp (absolutely positioned) */ }
          <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', padding: 14}}>
            <Text style={{fontSize: 12, color: colors.slateGrey}}>
              {this.timestamp}
            </Text>
          </View>

          { /* Top */ }
          <View style={styles.top}>

            { /* Profile picture or Initials */ }
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
              {(this.props.broadcast.caster.profilePic && this.props.broadcast.caster.profilePic.indexOf('http') >= 0)
                ? <Image style={styles.profilePic} source={{uri: this.props.broadcast.caster.profilePic}} />
                : <View style={styles.initials}>
                    <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                      {`${this.props.broadcast.caster.firstName.charAt(0)}${this.props.broadcast.caster.lastName.charAt(0)}`}
                    </Text>
                </View> }
            </View>

            { /* Cast Title and Caster Username */ }
            <View style={{flex: 0.8, paddingLeft: 10, backgroundColor: 'transparent'}}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.deepBlue, fontSize: 17, fontWeight: '600'}}>
                  {this.props.broadcast.title}
                </Text>
                <Text style={{color: colors.maastrichtBlue, fontSize: 15, fontWeight: '400'}}>
                  {this.props.broadcast.caster.username}
                </Text>
              </View>
            </View>
          </View>

          { /* Bottom */ }
          <View style={styles.bottom}>

            { /* Amount */ }
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: colors.gradientGreen, fontSize: 14, alignSelf: 'flex-start'}}>
                  {`$`}
                </Text>
                <Text style={{color: colors.gradientGreen, fontSize: 24, alignSelf: 'center'}}>
                  {this.props.broadcast.amount}
                </Text>
              </View>
            </View>

            { /* Frequency and Spot Availability */ }
            <View style={{flex: 0.8, paddingLeft: 8, justifyContent: 'center'}}>
              <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <EvilIcons name={"calendar"} color={colors.slateGrey} size={24} />
                  <Text style={{color: colors.deepBlue, fontSize: 15, paddingLeft: 4, paddingBottom: 2}}>
                    {this.props.broadcast.freq.charAt(0).concat(this.props.broadcast.freq.substring(1, this.props.broadcast.freq.length).toLowerCase())}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <EvilIcons name={"user"} color={colors.slateGrey} size={24} />
                  <Text style={{color: colors.deepBlue, fontSize: 15, paddingLeft: 4, paddingBottom: 2}}>
                    {`${this.spotsAvailable} spot${(this.spotsAvailable === 1) ? '' : 's'} available`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = CastCard
