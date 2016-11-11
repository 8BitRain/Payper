import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Dimensions, Image, ListView, DataSource, RecyclerViewBackedScrollView, StatusBar, Animated, Easing, ActionSheetIOS, Alert } from 'react-native'
import * as Lambda from '../../services/Lambda'
import moment from 'moment'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from '../../styles/colors'

const dims = Dimensions.get('window')
let imageDims = {
  width: 56,
  height: 56
}

class paydetails extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections([]),
      expandedIDs: {}
    }

    let firstName = this.props.name.split(" ")[0]
    let endsInS = firstName.charAt(firstName.length - 1) === 's'
    this.outgoingTransferStatuses = {
      "arrived": "Arrived in " + firstName + ((endsInS) ? "'" : "'s") + " bank account.",
      "uninitiated": "Will initiate on the specified date.",
      "initiated": "Funds will leave your bank account 3-5 business days from the specified date."
    }

    this.incomingTransferStatuses = {
      "arrived": "Arrived in your bank account.",
      "uninitiated": "Will initiate on the specified date.",
      "initiated": "Funds will arrive in your bank account 3-5 business days from the specified date."
    }

    this.ACTION_SHEET_CONFIG = {
      options: [
        "Block User",
        "Cancel Payment Series",
        "Nevermind"
      ],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1
    }

    this.animatedValues = {}
  }

  componentDidMount() {
    let detailRows = this.generateDetailRows()

    // TODO: Finish timeline generator
    // let timelineRows = (this.props.status.indexOf("pending") === -1) ? this.generateTimelineRows() : {}
    let timelineRows = {}

    let sectionlessRows = (this.props.incoming === false && this.props.status === "pendingConfirmation") ? {"": [{key: "Accept or Reject Request", val: ""}]} : {}
    let allRows = Object.assign({}, sectionlessRows, detailRows, timelineRows)
    this.setState({ rows: this.EMPTY_DATA_SOURCE.cloneWithRowsAndSections(allRows) })
  }

  cancelPayment() {
    let { token, pid, paymentType, status } = this.props

    Alert.alert(
      "Wait!",
      "Are you sure you'd like to cancel this payment series?",
      [
        {text: 'Nevermind', onPress: () => console.log('Nevermind'), style: 'cancel'},
        {text: 'Yes', onPress: () => confirm()},
      ]
    )

    function confirm() {
      // TODO: Optimistically delete payment card
      Lambda.cancelPayment({
        token: token,
        payment_id: pid,
        type: paymentType,
        status: status
      })

      Actions.pop()
    }
  }

  acceptRequest(payment) {
    let { token, pid, paymentType, status } = this.props

    // TODO: Optimistically mark payment card as confirmed
    Lambda.confirmPayment({
      token: token,
      payment_id: pid,
      type: paymentType,
      status: status
    })

    Actions.pop()
  }

  rejectRequest(payment) {
    let { token, pid, paymentType, status } = this.props

    // TODO: Optimistically mark payment card as confirmed
    Lambda.rejectPayment({
      token: token,
      payment_id: pid,
      type: paymentType,
      status: status
    })

    Actions.pop()
  }

  blockUser() {
    console.log("blockUser was invoked...")
  }

  showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions(this.ACTION_SHEET_CONFIG, (i) => {
      switch (this.ACTION_SHEET_CONFIG.options[i]) {
        case "Cancel Payment Series": this.cancelPayment()
          break;
        case "Block User": this.blockUser()
          break;
      }
    });
  }

  generateDetailRows() {
    let { payments, paymentsMade, status, nextTimestamp, purpose, amount, frequency, name, incoming } = this.props
    let firstName = name.split(" ")[0]
    let endsInS = firstName.charAt(firstName.length - 1) === 's'

    let statuses = {
      "active": "Active",
      "pendingSenderFundingSource": (incoming) ? "Pending - " + firstName + " needs to add a bank account." : "Pending - You need to add a bank account.",
      "pendingRecipFundingSource": (incoming) ? "Pending - You need to add a bank account." : "Pending - " + firstName + " needs to add a bank account.",
      "pendingBothFundingSources": "Pending - Both you and " + firstName + " need to add bank accounts.",
      "pendingInvite": "Pending - We invited " + firstName + " to join Payper.",
      "pendingConfirmation": (incoming) ? "Pending - " + firstName + " must confirm your request." : "Pending - You must confirm " + firstName + ((endsInS) ? "'" : "'s") + " request."
    }

    let rows = {
      "Payment Details": [
        {key: "Status", val: statuses[status]},
        {key: "Current Payment", val: paymentsMade + " of " + payments},
        {key: "Next Payment", val: moment(nextTimestamp).format("MMM D [around] h:mma")},
        {key: "Purpose", val: purpose},
        {key: "Amount", val: "$" + amount},
        {key: "Frequency", val: frequency}
      ]
    }

    return rows
  }

  generateTimelineRows() {
    let map = {"Payment Timeline": []}
    let rows = map["Payment Timeline"]

    this.props.timeline.map(row => {
      let height = new Animated.Value(1)
      let textColorInterpolator = new Animated.Value(0)
      let chevronAngleInterpolator = new Animated.Value(0)

      this.animatedValues[row.id] = {
        height: height,
        textColorInterpolator: textColorInterpolator,
        textColor: textColorInterpolator.interpolate({
          inputRange: [0, 125], // deepBlue, dodgerBlue
          outputRange: ['rgba(0, 16, 33, 1.0)', 'rgba(16, 152, 247, 1.0)'],
        }),
        chevronAngleInterpolator: chevronAngleInterpolator,
        chevronAngle: chevronAngleInterpolator.interpolate({
          inputRange: [0, 60], // 0deg, 180deg
          outputRange: ['0deg', '180deg']
        })
      }

      rows.push(row)
    })

    return map
  }

  renderRow(rowData, sectionTitle) {
    console.log("rowData", rowData)
    if (sectionTitle === "" && rowData.key === "Accept or Reject Request") return this.renderAcceptRejectRow()
    if (sectionTitle === 'Payment Timeline') return this.renderTimelineRow(rowData)
    if (sectionTitle === 'Payment Details') return this.renderDetailRow(rowData)

    return <View style={{height: 0}} />
  }

  renderDetailRow(params) {
    let { key, val } = params
    let { status } = this.props
    let splitVal = val.split(" - ")

    return(
      <View style={{flexDirection: 'column', borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
          <Text style={{color: colors.deepBlue}}>
            { key }
          </Text>
          <Text style={{color: colors.deepBlue}}>
            { splitVal[0] }
          </Text>
        </View>

        {(splitVal.length > 1)
          ? <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 0}}>
              <EvilIcons name={"exclamation"} size={20} color={colors.alertYellow} style={{paddingRight: 5}} />
              <Text style={{color: colors.deepBlue, width: dims.width * 0.8}}>
                {splitVal[1]}
              </Text>
            </View>
          : null }
      </View>
    )
  }

  renderTimelineRow(params) {
    let { timestamp, amount, transferStatus, bankAccount, id } = params
    let { incoming } = this.props

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.mintCream}
        onPress={() => (this.animatedValues[id].height._value === 1) ? this.expand(id) : this.shrink(id)}>
        <View style={{borderColor: colors.slateGrey, borderBottomWidth: 1.0}}>
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
              { /* Timestamp */ }
              <Animated.Text style={{color: this.animatedValues[id].textColor}}>
                { timestamp }
              </Animated.Text>

              { /* Amount, check mark or clock, and chevron */ }
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: (incoming) ? colors.alertGreen : colors.alertRed, alignItems: 'center'}}>
                  {((incoming) ? "+" : "-") + "$" + amount}
                </Text>

                <EvilIcons name={(transferStatus === 'arrived') ? "check" : "clock"} size={18} color={(transferStatus === 'arrived') ? colors.alertGreen : colors.alertYellow} style={{paddingLeft: 6}} />

                <Animated.View style={{ marginLeft: 4, transform: [{ rotate: this.animatedValues[id].chevronAngle }] }}>
                  <Entypo name={"chevron-thin-down"} size={16} color={colors.slateGrey} />
                </Animated.View>
              </View>
            </View>
          </View>

          <Animated.View style={{height: this.animatedValues[id].height}}>
            <View style={{flex: 1.0, flexDirection: 'column', overflow: 'hidden', margin: 10, marginTop: 0}}>
              <Text style={{color: colors.deepBlue}}>
                {"Bank account: " + bankAccount}
              </Text>

              <Text style={{color: colors.deepBlue}}>
                {"Transfer status: " + ((incoming) ? this.incomingTransferStatuses[transferStatus] : this.outgoingTransferStatuses[transferStatus])}
              </Text>
            </View>
          </Animated.View>
        </View>
      </TouchableHighlight>
    )
  }

  renderAcceptRejectRow() {
    return(
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1.0}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            onPress={() => this.acceptRequest()}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <EvilIcons name={"like"} size={80} color={colors.dodgerBlue} />
              <Text style={{color: colors.deepBlue, fontSize: 16, textAlign: 'center', fontWeight: '300'}}>
                {"Accept\nRequest"}
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            onPress={() => this.rejectRequest()}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <EvilIcons name={"like"} size={80} color={colors.alertRed} style={{transform: [{rotate: '180deg'}]}} />
              <Text style={{color: colors.deepBlue, fontSize: 16, textAlign: 'center', fontWeight: '300'}}>
                {"Reject\nRequest"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  renderSectionHeader(sectionData, sectionTitle) {
    if (sectionTitle.length === 0) {
      return(
        <View style={{height: 0}} />
      )
    } else {
      return(
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: colors.gainsboro}}>
          <Text style={{color: colors.deepBlue}}>{ sectionTitle }</Text>
        </View>
      )
    }
  }

  expand(id) {
    let valToExpand = this.animatedValues[id].height
    let colorToInterpolate = this.animatedValues[id].textColorInterpolator
    let angleToRotate = this.animatedValues[id].chevronAngleInterpolator

    Animated.parallel([
      Animated.timing(valToExpand, {
        toValue: 100,
        duration: 170,
        easing: Easing.elastic(0.35)
      }),
      Animated.spring(colorToInterpolate, {
        toValue: 125
      }),
      Animated.timing(angleToRotate, {
        toValue: 60,
        duration: 60
      })
    ]).start()
  }

  shrink(id) {
    let valToShrink = this.animatedValues[id].height
    let colorToInterpolate = this.animatedValues[id].textColorInterpolator
    let angleToRotate = this.animatedValues[id].chevronAngleInterpolator

    Animated.parallel([
      Animated.timing(valToShrink, {
        toValue: 1,
        duration: 170,
        easing: Easing.elastic(0.35)
      }),
      Animated.spring(colorToInterpolate, {
        toValue: 0
      }),
      Animated.timing(angleToRotate, {
        toValue: 0,
        duration: 60
      })
    ]).start()
  }

  getInitials() {
    let { name } = this.props
    let buffer = name.split(" ").map((name) => name.charAt(0))
    let initials = buffer.join("")
    return initials
  }

  render() {
    let { pic, name, username, purpose, amount, frequency, next, incoming, payments } = this.props

    return(
      <View style={styles.wrap}>
        <StatusBar barStyle='default' />

        { /* Back chevron profile pic, and action sheet toggler */ }
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: dims.width, paddingTop: 15, paddingBottom: 15}}>
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            style={{padding: 25, paddingTop: 0}}
            onPress={() => Actions.pop()}>
            <Entypo name={"chevron-thin-left"} size={22} color={colors.deepBlue} />
          </TouchableHighlight>

          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.imageWrap}>
              {(pic)
                ? <Image style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2}} source={{uri: pic}} />
                : <View style={{width: imageDims.width, height: imageDims.height, borderRadius: imageDims.width / 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                      {this.getInitials()}
                    </Text>
                  </View> }
            </View>
            <Text style={{color: colors.deepBlue, fontSize: 22, fontWeight: '200', paddingTop: 8, textAlign: 'center', backgroundColor: 'transparent'}}>
              {name}
            </Text>
            <Text style={{color: colors.dodgerBlue, fontSize: 16, fontWeight: '200', paddingTop: 4, textAlign: 'center', backgroundColor: 'transparent'}}>
              {username}
            </Text>
          </View>

          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.mintCream}
            style={{padding: 25, paddingTop: 0}}
            onPress={() => this.showActionSheet()}>
            <Entypo name={"dots-three-horizontal"} size={22} color={colors.deepBlue} />
          </TouchableHighlight>
        </View>

        { /* Situational buttons, payment details and timeline */ }
        <ListView
          style={{width: dims.width, backgroundColor: 'transparent'}}
          dataSource={this.state.rows}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderFooter={() => <View style={{height: 90}} />}
          enableEmptySections />
      </View>
    )
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.mintCream,
    paddingTop: 20,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
}

module.exports = paydetails
