import React from 'react'
import moment from 'moment'
import { View, TouchableHighlight, ListView, ScrollView, RecyclerViewBackedScrollView, Dimensions, Animated, Easing, StatusBar, Text } from 'react-native'
import { VibrancyView } from "react-native-blur"
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
    let chevronAngleInterpolator = new Animated.Value(0)
    this.animatedValues = {
      chevronAngleInterpolator: chevronAngleInterpolator,
      chevronAngle: chevronAngleInterpolator.interpolate({
        inputRange: [0, 150],
        outputRange: ['0deg', '180deg']
      }),
      plusAngleInterpolator: plusAngleInterpolator,
      plusAngle: plusAngleInterpolator.interpolate({
        inputRange: [0, 150],
        outputRange: ['0deg', '135deg']
      }),
      filterMenuHeight: new Animated.Value(1)
    }

    this.state = {
      ds: this.EMPTY_DATA_SOURCE.cloneWithRows({}),
      drawerOpen: false,
      filterMenuOpen: false,
      activeFilter: "All"
    }
  }

  componentWillMount() {
    let recentActivity = this.generateRecentActivity()
    let payCards = this.generatePayCards()
    let allRows = Object.assign({}, recentActivity, payCards)

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
    Animated.timing(plusAngleInterpolator, {
      toValue: 150,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  rotateToPlus() {
    let { plusAngleInterpolator } = this.animatedValues

    Animated.timing(plusAngleInterpolator, {
      toValue: 0,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  toggleFilterMenu() {
    let { chevronAngleInterpolator, filterMenuHeight } = this.animatedValues

    this.setState({filterMenuOpen: !this.state.filterMenuOpen}, () => {
      Animated.parallel([
        Animated.timing(chevronAngleInterpolator, {
          toValue: (this.state.filterMenuOpen) ? 150 : 0,
          duration: 150,
          easing: Easing.elastic(0.4)
        }),
        Animated.timing(filterMenuHeight, {
          toValue: (this.state.filterMenuOpen) ? 75 : 0,
          duration: 150,
          easing: Easing.elastic(0.4)
        })
      ]).start()
    })
  }

  toggleFilter(f) {
    this.setState({ activeFilter: f }, () => {
      this.toggleFilterMenu()
    })
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

        <View style={{flex: 1.0, backgroundColor: colors.mintCream}}>
          <StatusBar barStyle={"light-content"} />

          { /* Header */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={colors.deepBlue}
            onPress={() => this.toggleFilterMenu()}>
            <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: colors.deepBlue}}>
              <Text style={{color: colors.mintCream, fontSize: 17}}>
                {this.state.activeFilter + " Payments"}
              </Text>

              <Animated.View style={{position: 'absolute', top: 0, right: 6, paddingTop: 24}}>
                <Animated.View style={{ transform: [{ rotate: this.animatedValues.chevronAngle }] }}>
                  <EvilIcons name={"chevron-down"} size={34} color={colors.mintCream} />
                </Animated.View>
              </Animated.View>
            </View>
          </TouchableHighlight>

          <Animated.View style={{height: this.animatedValues.filterMenuHeight, backgroundColor: colors.maastrichtBlue}}>
            {(!this.state.filterMenuOpen)
              ? null
              : <View>
                  <ScrollView indicatorStyle={"white"} horizontal contentContainerStyle={{paddingLeft: 12, paddingRight: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    { /* All */ }
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor={colors.maastrichtBlue}
                      onPress={() => this.toggleFilter('All')}>
                      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <EvilIcons name={"eye"} size={38} color={colors.dodgerBlue} />
                        <Text style={{color: colors.mintCream, fontSize: 16}}>
                          {"All"}
                        </Text>
                      </View>
                    </TouchableHighlight>

                    { /* Outgoing */ }
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor={colors.maastrichtBlue}
                      onPress={() => this.toggleFilter('Outgoing')}>
                      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <EvilIcons name={"arrow-up"} size={38} color={colors.dodgerBlue} />
                        <Text style={{color: colors.mintCream, fontSize: 16}}>
                          {"Outgoing"}
                        </Text>
                      </View>
                    </TouchableHighlight>

                    { /* Incoming */ }
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor={colors.maastrichtBlue}
                      onPress={() => this.toggleFilter('Incoming')}>
                      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <EvilIcons name={"arrow-down"} size={38} color={colors.dodgerBlue} />
                        <Text style={{color: colors.mintCream, fontSize: 16}}>
                          {"Incoming"}
                        </Text>
                      </View>
                    </TouchableHighlight>

                    { /* Soonest */ }
                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor={colors.maastrichtBlue}
                      onPress={() => this.toggleFilter('Soonest')}>
                      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <EvilIcons name={"calendar"} size={38} color={colors.dodgerBlue} />
                        <Text style={{color: colors.mintCream, fontSize: 16}}>
                          {"Soonest"}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </ScrollView>
                </View> }
          </Animated.View>

          { /* Banner info and payment list */ }
          <ListView
            dataSource={ds}
            renderRow={this.renderRow.bind(this)}
            renderFooter={() => <View style={{height: 90}} />}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />

          { /* Footer */ }
          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.deepBlueOpaque}}>
            <VibrancyView blurType="dark" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />

            { /* User button */ }
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={colors.deepBlue}
                onPress={() => this.drawer.open()}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, paddingRight: 20}}>
                  <EvilIcons name={"chevron-left"} size={30} color={colors.gainsboro} style={{marginRight: -5}} />
                  <EvilIcons name={"user"} size={40} color={colors.dodgerBlue} />
                </View>
              </TouchableHighlight>
            </View>

            { /* New payment button */ }
            <TouchableHighlight
              activeOpacity={0.85}
              underlayColor={'transparent'}
              onPress={() => alert("Would open create payment flow")}
              style={{padding: 14, paddingRight: 20}}>
              <Animated.View style={{justifyContent: 'center', alignItems: 'center', transform: [{ rotate: this.animatedValues.plusAngle }]}}>
                <EvilIcons name={"plus"} size={40} color={colors.dodgerBlue} />
              </Animated.View>
            </TouchableHighlight>
          </View>
        </View>
      </Drawer>
    )
  }
}

module.exports = NewMainView
