import React from 'react'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import {unsubscribe} from '../../../helpers/broadcasts'
import {Icon, SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret} from '../'
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
    this.spotsAvailable = props.broadcast.memberLimit - props.broadcast.memberIDs.split(",").length
    this.onUnsubscribe = this.onUnsubscribe.bind(this)
  }

  onUnsubscribe() {
    // Delete subscription from list
    let meFeed = this.props.currentUser.meFeed
    delete meFeed["My Subscriptions"][this.props.broadcast.castID]

    // Update current user via Redux
    this.props.updateCurrentUser({meFeed: meFeed})

    // Page back to Main view and switch to 'Me' tab
    Actions.pop()
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
            <SubscribeButton text={"Unsubscribe"} color={colors.carminePink} onPress={() => unsubscribe({broadcast: this.props.broadcast, onConfirm: this.onUnsubscribe})} />
          </View>

          { /* Details of Agreement */ }
          <DetailsOfAgreement width={dims.width * 0.88} broadcast={this.props.broadcast} />

          { /* Secret */ }
          <Secret width={dims.width * 0.88} broadcast={this.props.broadcast} hide={false} />

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
