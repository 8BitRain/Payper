import React from 'react'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions} from 'react-native'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import {subscribe} from '../../../helpers/broadcasts'
import {subscribeToCast} from '../../../helpers/lambda'
import {Firebase} from '../../../helpers'
import {Icon, SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret} from '../'
import {Header} from '../../'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import * as dispatchers from '../../../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
})

class UnjoinedBroadcastView extends React.Component {
  constructor(props) {
    super(props)

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.members) ? 0 : props.broadcast.members.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled

    this.onSubscribe = this.onSubscribe.bind(this)
  }

  onSubscribe() {

    // Update current user's meFeed data source
    let meFeed = this.props.currentUser.meFeed

    // Add joinedAt timestamp
    this.props.broadcast.joinedAt = Date.now()

    // Mutate meFeed object via Redux
    if (!meFeed["My Subscriptions"]) meFeed["My Subscriptions"] = []
    meFeed["My Subscriptions"].unshift(this.props.broadcast)
    this.props.updateCurrentUser({meFeed: meFeed})

    // Hit backend
    subscribeToCast({
      castID: this.props.broadcast.castID,
      token: this.props.currentUser.token
    })

    // Update userFeed in Firebase
    Firebase.get(`userFeed/${this.props.currentUser.uid}`, (userFeed) => {
      delete userFeed[this.props.broadcast.castID]
      Firebase.set(`userFeed/${this.props.currentUser.uid}`, userFeed)
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
          showDots
          onDotsPress={() => alert("SHOW ACTION SHEET")}
          title={this.props.broadcast.title} />

        <ScrollView>
          { /* Icon, Title, Amount, Frequency */ }
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, marginTop: 10, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            <Icon size={26} width={57} height={57} />

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

          { /* Spots available, Subscribe button */ }
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            <SpotsAvailable broadcast={this.props.broadcast} />
            <SubscribeButton onPress={() => subscribe({broadcast: this.props.broadcast, onConfirm: this.onSubscribe})} />
          </View>

          { /* Details of Agreement */ }
          <DetailsOfAgreement width={dims.width * 0.88} broadcast={this.props.broadcast} />

          { /* Secret */ }
          <Secret width={dims.width * 0.88} broadcast={this.props.broadcast} hide={true} />
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(UnjoinedBroadcastView)
