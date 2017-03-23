import React from 'react'
import * as _ from 'lodash'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import {unsubscribeAlert} from '../../../helpers/alerts'
import {unsubscribeFromCast} from '../../../helpers/lambda'
import {Firebase} from '../../../helpers'
import {ProfilePic} from '../../'
import {SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret} from '../'
import {Header} from '../../'
import {connect} from 'react-redux'
import * as dispatchers from '../../../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
})

class JoinedBroadcastView extends React.Component {
  constructor(props) {
    super(props)

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.members) ? 0 : props.broadcast.members.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled

    this.onUnsubscribe = this.onUnsubscribe.bind(this)
  }

  onUnsubscribe() {

    // Update current user's meFeed data source
    let meFeed = this.props.currentUser.meFeed

    // Mutate meFeed object via Redux
    let i = _.indexOf(meFeed["My Subscriptions"], function(o) { return o.castID === this.props.broadcast.castID })
    meFeed["My Subscriptions"].splice(i, 1)
    this.props.updateCurrentUser({meFeed: meFeed})

    // Hit backend
    unsubscribeFromCast({
      castID: this.props.broadcast.castID,
      token: this.props.currentUser.token
    })

    // Update subscribedBroadcasts in Firebase
    Firebase.get(`subscribedBroadcasts/${this.props.currentUser.uid}`, (subscribedBroadcasts) => {
      delete subscribedBroadcasts[this.props.broadcast.castID]
      Firebase.set(`subscribedBroadcasts/${this.props.currentUser.uid}`, subscribedBroadcasts)
    })

    // Page back to Main view and switch to 'Me' tab
    Actions.pop()
    setTimeout(() => Actions.refresh({newTab: 'Me'}))

  }

  render() {
    return(
      <View style={styles.container}>

        { /* Header */ }
        <Header
          showTitle
          showBackButton
          title={this.props.broadcast.title} />

        <ScrollView>
          { /* Profile Pic, Title, Amount, Frequency */ }
          <TouchableHighlight
            activeOpacity={(this.props.canViewCasterProfile === false) ? 1 : 0.75}
            underlayColor={'transparent'}
            onPress={() => (this.props.canViewCasterProfile === false) ? null : Actions.UserProfile({user: this.props.broadcast.caster})}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, marginTop: 10, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
              <ProfilePic size={57} currentUser={this.props.broadcast.caster} />

              <View style={{paddingLeft: 20}}>
                <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '700'}}>
                  {this.props.broadcast.title}
                </Text>
                <Text style={{color: colors.accent, fontSize: 16, fontWeight: '600'}}>
                  {this.props.broadcast.caster.username}
                </Text>
                <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2}}>
                  {`$${this.props.broadcast.amount} per ${this.frequency}`}
                </Text>
              </View>
            </View>
          </TouchableHighlight>

          { /* Spots available, Subscribe button */ }
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            <SpotsAvailable broadcast={this.props.broadcast} />
            <SubscribeButton text={"Unsubscribe"} color={colors.carminePink} onPress={() => unsubscribeAlert({broadcast: this.props.broadcast, onConfirm: this.onUnsubscribe})} />
          </View>

          { /* Details of Agreement */ }
          <DetailsOfAgreement width={dims.width * 0.88} broadcast={this.props.broadcast} />

          { /* Secret */ }
          <Secret
            shouldDecrypt
            width={dims.width * 0.88}
            broadcast={this.props.broadcast}
            currentUser={this.props.currentUser} />

        </ScrollView>
      </View>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(JoinedBroadcastView)
