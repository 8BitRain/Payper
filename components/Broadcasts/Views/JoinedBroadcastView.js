import React from 'react'
import moment from 'moment'
import * as _ from 'lodash'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, ActionSheetIOS, Dimensions, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency, callbackForLoop} from '../../../helpers/utils'
import {unsubscribeAlert} from '../../../helpers/alerts'
import {unsubscribeFromCast, createDispute} from '../../../helpers/lambda'
import {Firebase} from '../../../helpers'
import {ProfilePic} from '../../'
import {SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret, Member} from '../'
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

    this.state = {
      members: [],
      datesJoined: {},
      renewalDate: null,
      renewalDateModalIsVisible: false
    }

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.members) ? 0 : props.broadcast.members.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled

    this.showActionSheet = this.showActionSheet.bind(this)
    this.onUnsubscribe = this.onUnsubscribe.bind(this)
  }

  componentDidMount() {
    this.populateMembers(this.props.broadcast.members)
  }

  populateMembers(memberIDs) {
    if (!memberIDs) return
    let memberIDBuffer = memberIDs.split(",")
    let members = []

    // Fetch user data for each cast member
    callbackForLoop(0, memberIDBuffer.length, {
      onIterate: (loop) => {
        let memberID = memberIDBuffer[loop.index]
        Firebase.get(`usersPublicInfo/${memberID}`, (userData) => {
          userData.uid = memberID
          members.push(userData)
          loop.continue()
        })
      },
      onComplete: () => this.setState({members})
    })
  }

  showActionSheet() {
    let options = ['Create Dispute', 'Cancel']
    let callbacks = {
      'Create Dispute': () => this.createDispute(),
      'Cancel': () => null
    }

    // TODO: Implement cross-plaftorm action sheet module
    ActionSheetIOS.showActionSheetWithOptions({
      options,
      cancelButtonIndex: options.indexOf('Cancel')
    }, (i) => callbacks[options[i]]())
  }

  removeMember(member) {
    removeFromCastAlert({
      member,
      onConfirm: () => {
        Firebase.get(`usernames/${member.username}`, (userData) => {
          kickFromCast({
            castID: this.props.broadcast.castID,
            kickedUid: userData.uid,
            token: this.props.currentUser.token
          })
        })
      }
    })
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

  createDispute() {
    createDispute({castID: this.props.broadcast.castID, token: this.props.currentUser.token})
    Alert.alert('Created Dispute', 'A Payper representative will contact you via email to resolve your dispute.')
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Header */ }
        <Header
          showTitle
          showBackButton
          showDots
          onDotsPress={this.showActionSheet}
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
                <Text style={{color: colors.accent, fontSize: 15, fontWeight: '600'}}>
                  {this.props.broadcast.caster.username}
                </Text>
                <Text style={{color: colors.deepBlue, fontSize: 15, paddingTop: 2}}>
                  {`$${this.props.broadcast.amount} per ${this.frequency}`}
                </Text>
                <Text style={{color: colors.slateGrey, fontSize: 15, paddingBottom: 2}}>
                  {`Joined ${moment.utc(this.props.dateJoinedUTC).format("MMM D, YYYY")}`}
                </Text>
              </View>
            </View>
          </TouchableHighlight>

          { /* Cast members */
            (this.props.broadcast.members && this.props.broadcast.members.length > 0)
            ? <View style={{paddingTop: 10, paddingRight: 2, paddingBottom: 10, width: dims.width * 0.9, borderColor: colors.medGrey, borderBottomWidth: 1}}>
                <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
                  {"Members"}
                </Text>

                {(this.state.members.length === 0)
                  ? <Text style={{color: colors.deepBlue, fontSize: 16}}>
                      {"None"}
                    </Text>
                  : this.state.members.map((o, i) => <Member key={i} member={o} dateJoined={this.state.datesJoined[o.uid]} />)}
              </View>
            : null }

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
