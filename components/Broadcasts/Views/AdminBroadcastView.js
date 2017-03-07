// TODO: Implement cross-plaftorm action sheet module
import React from 'react'
import {View, TouchableHighlight, StyleSheet, Text, ScrollView, Dimensions, ActionSheetIOS, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../../globalStyles'
import {formatBroadcastTimestamp, formatFrequency} from '../../../helpers/utils'
import {unsubscribe} from '../../../helpers/broadcasts'
import {Icon, SubscribeButton, SpotsAvailable, DetailsOfAgreement, Secret, Member} from '../'
import {Header} from '../../'

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
    this.timestamp = formatBroadcastTimestamp(props.broadcast.createdAt)
    this.frequency = formatFrequency(props.broadcast.freq)
    this.spotsFilled = (!props.broadcast.memberIDs) ? 0 : props.broadcast.memberIDs.split(",").length
    this.spotsAvailable = props.broadcast.memberLimit - this.spotsFilled
    this.removeMember = this.removeMember.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
    this.stopRenewal = this.stopRenewal.bind(this)
    this.resumeRenewal = this.resumeRenewal.bind(this)
    this.delete = this.delete.bind(this)
  }

  removeMember(member) {
    alert(`Would remove member '${member.displayName}'`)
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
    // TODO: Hit back end
    this.props.broadcast.renewal = false
    Actions.refresh()
  }

  resumeRenewal() {
    // TODO: Hit back end
    this.props.broadcast.renewal = true
    Actions.refresh()
  }

  delete() {
    // TODO: Hit back end, handle optimistic deletion
    if (this.props.broadcast.renewal)
      Alert.alert("Can't Delete", "You must turn off renewal in order to delete a broadcast.")
    else
      Alert.alert("TODO", "Delete")
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

          { /* Icon, Title, Amount, Frequency */ }
          <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 15, paddingBottom: 15, marginTop: 10, width: dims.width * 0.88}}>
            <Icon size={26} width={57} height={57} />

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

          { /* Renewal status */ }
          <View style={{paddingBottom: 10, width: dims.width * 0.88, borderColor: colors.medGrey, borderBottomWidth: 1}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, paddingTop: 2, backgroundColor: 'transparent'}}>
              {`In renewal: ${this.props.broadcast.renewal}`}
            </Text>
          </View>

          { /* Cast members */
            (this.props.broadcast.members && this.props.broadcast.members.length > 0)
            ? <View style={{paddingTop: 10, paddingRight: 2, paddingBottom: 10, width: dims.width * 0.9, borderColor: colors.medGrey, borderBottomWidth: 1}}>
                <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700'}}>
                  {"Members"}
                </Text>
                {this.props.broadcast.members.map((o, i) => <Member key={i} member={o} remove={this.removeMember} />)}
              </View>
            : null }

          { /* Details of Agreement */ }
          <DetailsOfAgreement width={dims.width * 0.88} broadcast={this.props.broadcast} />

          { /* Secret */ }
          <Secret width={dims.width * 0.88} broadcast={this.props.broadcast} hide={false} />

        </ScrollView>
      </View>
    )
  }
}

module.exports = AdminBroadcastView
