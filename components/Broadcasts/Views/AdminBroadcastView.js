// TODO: Implement cross-plaftorm action sheet module
import React from 'react'
import * as _ from 'lodash'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions, ActionSheetIOS, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import {removeFromCastAlert} from '../../../helpers/alerts'
import {formatBroadcastTimestamp, formatFrequency, callbackForLoop} from '../../../helpers/utils'
import {Firebase} from '../../../helpers'
import {deleteCastAlert} from '../../../helpers/alerts'
import {deleteCast, kickFromCast, stopRenewal, resumeRenewal} from '../../../helpers/lambda'
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

class AdminBroadcastView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      members: [],
      datesJoined: {},
      renewalDate: null
    }

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.members) ? 0 : props.broadcast.members.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled

    this.removeMember = this.removeMember.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.stopRenewal = this.stopRenewal.bind(this)
    this.resumeRenewal = this.resumeRenewal.bind(this)
    this.delete = this.delete.bind(this)
    this.populateMembers = this.populateMembers.bind(this)
    this.populateDates = this.populateDates.bind(this)
  }

  componentDidMount() {
    this.populateMembers(this.props.broadcast.members)
    this.populateDates()
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

  populateDates() {
    Firebase.get(`castPayments/${this.props.broadcast.castID}`, (res) => {
      console.log("--> castPayments res", res)
    })
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

  showActionSheet() {
    let options = [
      (this.props.broadcast.renewal) ? 'Stop Renewal' : 'Resume Renewal',
      'Delete',
      'Cancel'
    ]
    let cancelButtonIndex = options.indexOf('Cancel')
    let destructiveButtonIndex = options.indexOf('Delete')
    let callbacks = {
      'Stop Renewal': this.stopRenewal,
      'Resume Renewal': this.resumeRenewal,
      'Delete': this.delete,
      'Cancel': () => null
    }

    // TODO: Implement cross-plaftorm action sheet module
    ActionSheetIOS.showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (i) => callbacks[options[i]]())
  }

  stopRenewal() {
    // Optimistically re-render
    this.props.broadcast.renewal = false
    Actions.refresh()

    // Hit backend
    stopRenewal({
      token: this.props.currentUser.token,
      castID: this.props.broadcast.castID
    })
  }

  resumeRenewal() {
    // Optimistically re-render
    this.props.broadcast.renewal = true
    Actions.refresh()

    // Hit backend
    resumeRenewal({
      token: this.props.currentUser.token,
      castID: this.props.broadcast.castID
    })
  }

  delete() {
    if (this.props.broadcast.renewal) {
      Alert.alert("Can't Delete", "You must turn off renewal in order to delete a broadcast.")
    } else {
      deleteCastAlert({
        broadcast: this.props.broadcast,
        onConfirm: () => {

          // Update current user's meFeed data source
          let meFeed = this.props.currentUser.meFeed

          // Mutate meFeed object via Redux
          let i = _.indexOf(meFeed["My Broadcasts"], function(o) { return o.castID === this.props.broadcast.castID })
          meFeed["My Broadcasts"].splice(i, 1)
          this.props.updateCurrentUser({meFeed: meFeed})

          // Hit backend
          deleteCast({
            castID: this.props.broadcast.castID,
            token: this.props.currentUser.token
          })

          // Page back to Main view and switch to 'Me' tab
          Actions.pop()
          setTimeout(() => Actions.refresh({newTab: 'Me'}))

        }
      })
    }
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
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, marginTop: 10, width: dims.width * 0.88}}>
            <ProfilePic size={57} currentUser={this.props.currentUser} />

            <View style={{paddingLeft: 20}}>
              <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '700', backgroundColor: 'transparent'}}>
                {this.props.broadcast.title}
              </Text>
              <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, backgroundColor: 'transparent'}}>
                {`$${this.props.broadcast.amount} per ${this.frequency}`}
              </Text>
              <Text style={{color: colors.accent, fontSize: 16, fontWeight: '500', backgroundColor: 'transparent'}}>
                {`${this.spotsFilled} of ${this.props.broadcast.memberLimit} spots filled`}
              </Text>
            </View>
          </View>

          { /* Renewal date */ }
          <View style={{paddingBottom: 10, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            {(this.state.renewalDate)
              ? <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, backgroundColor: 'transparent'}}>
                  {(this.props.broadcast.renewal)
                    ? `Renews on ${this.state.renewalDate}.`
                    : `Renewal is disabled.`}
                </Text>
              : null }
          </View>

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
                  : this.state.members.map((o, i) => <Member key={i} member={o} dateJoined={this.state.datesJoined[o.uid]} remove={this.removeMember} />)}
              </View>
            : null }

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(AdminBroadcastView)
