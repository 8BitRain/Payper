import React from 'react'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions, Modal, Alert, ActionSheetIOS} from 'react-native'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import {subscribeAlert} from '../../../helpers/alerts'
import {subscribeToCast} from '../../../helpers/lambda'
import {share} from '../../../helpers/broadcasts'
import {Firebase} from '../../../helpers'
import {ProfilePic} from '../../'
import {SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret} from '../'
import {Header, OnSubscribeModal} from '../../'
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

    this.state = {
      loading: false,
      onSubscribeModalVisible: false,
      decryptedSecret: null
    }

    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.members) ? 0 : props.broadcast.members.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled

    this.onSubscribe = this.onSubscribe.bind(this)
  }

  showActionSheet() {
    let options = ['Share', 'Cancel']
    let callbacks = {
      'Share': () => share(),
      'Cancel': () => null
    }

    // TODO: Implement cross-plaftorm action sheet module
    ActionSheetIOS.showActionSheetWithOptions({
      options,
      cancelButtonIndex: options.indexOf('Cancel')
    }, (i) => callbacks[options[i]]())
  }

  onSubscribe() {

    // Display OnSubscribeModal
    this.setState({
      loading: true,
      onSubscribeModalVisible: true
    })

    // Hit backend
    subscribeToCast({
      castID: this.props.broadcast.castID,
      token: this.props.currentUser.token
    }, (res) => {
      if (res.errorMessage) {
        this.setState({
          loading: false,
          onSubscribeModalVisible: false,
          error: res.errorMessage
        })

        // Show error alert
        setTimeout(() => {
          if ("Cast full" === res.errorMessage)
            Alert.alert("Subscription Failed", "Looks like someone beat you to it! This broadcast is now full.")
          else
            Alert.alert("Subscription Failed", "Something went wrong on our end. Please try again later. Error: " + res.errorMessage)
        }, 650)
      } else if (res.decryptedSecret) {

        // Update onSubscribeModal contents
        this.setState({
          loading: false,
          decryptedSecret: res.decryptedSecret
        })

        // NOTE: A bug in this code results in duplicate subscription cards
        // // Update current user's meFeed data source
        // let meFeed = this.props.currentUser.meFeed
        //
        // // Add joinedAt timestamp
        // this.props.broadcast.joinedAt = Date.now()
        //
        // // Mutate meFeed object via Redux
        // if (!meFeed["My Subscriptions"]) meFeed["My Subscriptions"] = []
        // meFeed["My Subscriptions"].unshift(this.props.broadcast)
        // this.props.updateCurrentUser({meFeed: meFeed})

        // Update userFeed in Firebase
        Firebase.get(`userFeed/${this.props.currentUser.uid}`, (userFeed) => {
          delete userFeed[this.props.broadcast.castID]
          Firebase.set(`userFeed/${this.props.currentUser.uid}`, userFeed)
        })

      }
    })
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
                <Text style={{color: colors.accent, fontSize: 16, fontWeight: '600'}}>
                  {this.props.broadcast.caster.username}
                </Text>
                <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2}}>
                  {(this.props.broadcast.freq === "ONCE")
                    ? `$${this.props.broadcast.amount} one time payment`
                    : `$${this.props.broadcast.amount} per ${this.frequency}`}
                </Text>
              </View>
            </View>
          </TouchableHighlight>

          { /* Spots available, Subscribe button */ }
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            <SpotsAvailable broadcast={this.props.broadcast} />
            <SubscribeButton onPress={() => subscribeAlert({broadcast: this.props.broadcast, currentUser: this.props.currentUser, onConfirm: this.onSubscribe})} />
          </View>

          { /* Details of Agreement */ }
          <DetailsOfAgreement width={dims.width * 0.88} broadcast={this.props.broadcast} />

          { /* Secret */ }
          <Secret
            shouldDecrypt={false}
            width={dims.width * 0.88}
            broadcast={this.props.broadcast}
            currentUser={this.props.currentUser} />
        </ScrollView>

        { /* Modal displaying secret unlocker */ }
        <Modal visible={this.state.onSubscribeModalVisible} transparent={true} animationType={'fade'}>
          <OnSubscribeModal
            loading={this.state.loading}
            broadcast={this.props.broadcast}
            currentUser={this.props.currentUser}
            decryptedSecret={this.state.decryptedSecret}
            onBack={() => {
              this.setState({onSubscribeModalVisible: false})
              Actions.pop()
              setTimeout(() => Actions.refresh({newTab: 'Me'}))
            }} />
        </Modal>

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
