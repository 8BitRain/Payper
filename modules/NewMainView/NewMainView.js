import React from 'react'
import moment from 'moment'
import { View, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Dimensions, Animated, StatusBar } from 'react-native'
import { colors } from '../../globalStyles'
import { SideMenu, PayCard } from '../../components'
import Drawer from 'react-native-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

// TODO: Remove import
import { sampleSnapshot } from '../../db'

class NewMainView extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    let plusAngleInterpolator = new Animated.Value(0)
    this.animatedValues = {
      plusAngleInterpolator: plusAngleInterpolator,
      plusAngle: plusAngleInterpolator.interpolate({
        inputRange: [0, 150],
        outputRange: ['0deg', '135deg']
      })
    }

    this.state = {
      ds: this.EMPTY_DATA_SOURCE.cloneWithRows({}),
      drawerOpen: false
    }
  }

  componentWillMount() {
    let recentActivity = this.generateRecentActivity()
    let payCards = this.generatePayCards()
    let allRows = Object.assign({}, recentActivity, payCards)

    console.log("allRows", allRows)
    this.setState({
      ds: this.EMPTY_DATA_SOURCE.cloneWithRows(allRows)
    })
  }

  generateRecentActivity() {
    return {}
  }

  generatePayCards() {
    console.log("pulling payments from", sampleSnapshot.sampleSnapshot.paymentFlow["5FopYLYBoKWVmKWtz7KfcRNJaXY2"].in)
    return sampleSnapshot.sampleSnapshot.paymentFlow["5FopYLYBoKWVmKWtz7KfcRNJaXY2"].in
  }

  renderRow(rowData) {
    console.log("renderRow was invoked with rowData", rowData)
    return this.renderPayCard(rowData)
  }

  renderPayCard(payment) {
    let user = {
      name: (payment.flow == "incoming") ? payment.sender_name : payment.recip_name,
      username: (payment.flow == "incoming") ? payment.sender_username : payment.recip_username,
      pic: (payment.flow == "incoming") ? payment.sender_pic : payment.recip_pic
    }

    // TODO: Switch this back!
    // let frequency = payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1).toLowerCase()
    let frequency = "Weekly"
    let formattedTimestamp = moment(payment.nextPayment).format("MMM D")
    let next = (formattedTimestamp !== "Invalid date") ? formattedTimestamp : "TBD"

    let details = {
      pic: user.pic,
      name: user.name,
      username: user.username,
      purpose: payment.purpose,
      amount: payment.amount,
      frequency: frequency,
      nextTimestamp: payment.nextPayment,
      next: next,
      incoming: payment.flow === "incoming",
      status: payment.status,
      payments: payment.payments,
      paymentsMade: payment.paymentsMade,
      pid: payment.pid,
      // token: this.props.currentUser.token, TODO: Switch this back!
      token: "asdf",
      paymentType: payment.type,
      timeline: [
        {
          timestamp: "Jan 9th at 1:04pm",
          amount: 5,
          bankAccount: "UWCU Checking",
          transferStatus: "uninitiated",
          id: "1"
        }
      ]
    }

    return <PayCard {...details} />
  }

  rotateToX() {
    let { plusAngleInterpolator } = this.animatedValues

    Animated.spring(plusAngleInterpolator, {
      toValue: 150,
      durating: 200
    }).start()
  }

  rotateToPlus() {
    let { plusAngleInterpolator } = this.animatedValues

    Animated.spring(plusAngleInterpolator, {
      toValue: 0,
      durating: 200
    }).start()
  }

  render() {
    let { ds } = this.state

    return(
      <Drawer
        type={"overlay"}
        openDrawerOffset={dims.width * 0.275}
        ref={(ref) => this.drawer = ref}
        tapToClose
        tweenDuration={150}
        onOpenStart={() => this.rotateToX()}
        onCloseStart={() => this.rotateToPlus()}
        content={<SideMenu />}>

        <View style={{flex: 1.0}}>
          <StatusBar barStyle={"light-content"} />

          { /* Header */ }
          <View style={{paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={colors.deepBlue}
              onPress={() => this.drawer.open()}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, paddingLeft: 6}}>
                <EvilIcons name={"chevron-left"} size={30} color={colors.gainsboro} style={{marginRight: -5}} />
                <EvilIcons name={"user"} size={30} color={colors.dodgerBlue} />
              </View>
            </TouchableHighlight>
          </View>

          { /* Banner info and payment list */ }
          <ListView
            dataSource={ds}
            renderRow={this.renderRow.bind(this)}
            renderFooter={() => <View style={{height: 90}} />}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />

          { /* New payment button */ }
          <TouchableHighlight
            activeOpacity={0.85}
            underlayColor={'transparent'}
            onPress={() => alert("Would open create payment flow")}>
            <Animated.View style={{position: 'absolute', bottom: 0, right: 0, padding: 25, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: this.animatedValues.plusAngle }]}}>
              <EvilIcons name={"plus"} size={50} color={colors.dodgerBlue} />
            </Animated.View>
          </TouchableHighlight>
        </View>
      </Drawer>
    )
  }
}

module.exports = NewMainView
