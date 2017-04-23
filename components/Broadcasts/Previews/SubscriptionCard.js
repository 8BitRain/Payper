import React from 'react'
import moment from 'moment'
import {Actions} from 'react-native-router-flux'
import {View, Text, StyleSheet, TouchableHighlight, Dimensions, Image} from 'react-native'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency, getRenewalDateAndDateJoined} from '../../../helpers/utils'
import {ProfilePic} from '../../'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {connect} from 'react-redux'
import * as dispatchers from '../../../scenes/Main/MainState'

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

class SubscriptionCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dateJoinedUTC: null,
      renewalDateUTC: null
    }

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
  }

  componentDidMount() {
    getRenewalDateAndDateJoined({
      memberID: this.props.currentUser.uid,
      castID: this.props.broadcast.castID,
      frequency: this.props.broadcast.freq
    }, (res) => {
      let {renewalDate, dateJoined, renewalDateUTC, dateJoinedUTC} = res
      this.setState({renewalDateUTC, dateJoinedUTC}, () => console.log(this.state))
    })
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => Actions.JoinedBroadcast({broadcast: this.props.broadcast, canViewCasterProfile: this.props.canViewCasterProfile, dateJoinedUTC: this.state.dateJoinedUTC, renewalDateUTC: this.state.renewalDateUTC})}>
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
              <ProfilePic currentUser={this.props.broadcast.caster} size={46} />
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
                <Text style={{color: colors.gradientGreen, fontSize: (this.props.broadcast.amount.length > 5) ? 16 : 18, alignSelf: 'center'}}>
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
                  <Text style={{color: colors.slateGrey, fontSize: 15, paddingBottom: 2}}>
                    {`Joined ${moment.utc(this.state.dateJoined).format("MMM D, YYYY")}`}
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

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SubscriptionCard)
