import React from 'react'
import moment from 'moment'
import * as _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { View, TouchableHighlight, ListView, ScrollView, RecyclerViewBackedScrollView, Dimensions, Animated, Easing, StatusBar, Text, Image, Modal, Alert, TextInput } from 'react-native'
import { VibrancyView } from "react-native-blur"
import Drawer from 'react-native-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {colors} from '../../globalStyles'
import {
  SideMenu, PayCard, StatusCard, PhotoUploader, MicrodepositOnboarding,
  TrendingPayments, DynamicList, ExploreTrendingPaymentsButton, EmptyState,
  AlternateStatusCard
} from '../../components'
import KYCOnboardingView from '../../components/KYCOnboarding/KYCOnboardingView'
import {MyProfile, BankAccounts, Notifications, Invite, Settings} from '../../components/SideMenuSubpages'
import {BankOnboarding, PaymentOnboardingView} from '../../modules'
import {TrackOnce} from '../../classes/Metrics'
const dims = Dimensions.get('window')


class MainView extends React.Component {
  constructor(props) {
    super(props)

    let plusAngleInterpolator = new Animated.Value(0)
    let chevronAngleInterpolator = new Animated.Value(0)

    this.AV = {
      searchBarBGOpacity: new Animated.Value(0),
      chevronAngleInterpolator: chevronAngleInterpolator,
      chevronAngle: chevronAngleInterpolator.interpolate({inputRange: [0, 150], outputRange: ['0deg', '180deg']}),
      plusAngleInterpolator: plusAngleInterpolator,
      plusAngle: plusAngleInterpolator.interpolate({inputRange: [0, 150], outputRange: ['0deg', '135deg']})
    }

    this.state = {
      searchBarVisible: false,
      mounted: false
    }
  }

  componentWillMount() {
    if (this.props.currentUser.endpoints) this.props.currentUser.stopListening()
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.decrypt((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.getNativeContacts((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.startTokenRefresher((updates) => this.props.updateCurrentUser(updates))
    this.trackOnce = new TrackOnce()
  }

  componentDidMount() {
    // Hide contents of side menu until component has fully mounted to prevent
    // its visibility during slide animation
    setTimeout(() => {
      this.setState({mounted: true})
    }, 850)
  }

  componentWillReceiveProps(nextProps) {
    let {paymentListRef} = this.state
    let {paymentListUpdates} = nextProps
    if (paymentListUpdates && paymentListRef)
      paymentListRef.optimisticallyUpdate(paymentListUpdates)
    if (nextProps.cb && typeof nextProps.cb === 'function') {
      nextProps.cb()
      setTimeout(() => Actions.refresh({cb: null}), 20)
    }
  }

  rotateToX() {
    let { plusAngleInterpolator } = this.AV

    Animated.timing(plusAngleInterpolator, {
      toValue: 150,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  rotateToPlus() {
    let { plusAngleInterpolator } = this.AV

    Animated.timing(plusAngleInterpolator, {
      toValue: 0,
      duration: 320,
      easing: Easing.elastic(1.0)
    }).start()
  }

  toggleSearchBar() {
    this.setState({searchBarVisible: !this.state.searchBarVisible}, () => {
      let {searchBarBGOpacity} = this.AV

      // Toggle search bar background color
      Animated.timing(searchBarBGOpacity, {
        toValue: (this.state.searchBarVisible) ? 1 : 0,
        duration: 200
      }).start()

      // Toggle payment list header/footer visibility
      if (this.state.searchBarVisible) {
        this.state.paymentListRef.hideHeader()
        this.state.paymentListRef.hideFooter()
      } else {
        this.state.paymentListRef.filter("")
        this.state.paymentListRef.showHeader()
        this.state.paymentListRef.showFooter()
      }
    })
  }

  render() {
    let {mounted} = this.state

    return(
      <Drawer
        type={"overlay"}
        openDrawerOffset={80}
        ref={(ref) => this.drawer = ref}
        tapToClose
        tweenDuration={100}
        onOpenStart={() => this.rotateToX()}
        onCloseStart={() => this.rotateToPlus()}
        content={
          <View style={{flex: 1.0, opacity: (mounted) ? 1.0 : 0.0}}>
            <SideMenu {...this.props} />
          </View>
        }>

        <View style={{flex: 1.0, backgroundColor: colors.lightGrey}}>
          <StatusBar barStyle={(this.state.searchBarVisible) ? "default" : "light-content"} />

          { /* Header */ }
          <View style={{flexDirection: 'row', height: 60, overflow: 'hidden', borderBottomWidth: (this.state.searchBarVisible) ? 1 : 0, borderColor: colors.accent}}>
            <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
            <Animated.View style={{opacity: this.AV.searchBarBGOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.snowWhite}} />

            { /* Hamburger / X icon */ }
            <TouchableHighlight
              style={{flex: 0.15}}
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => (this.state.searchBarVisible) ? this.toggleSearchBar() : this.drawer.open()}>
              <View style={{flex: 1.0, paddingTop: 18, justifyContent: 'center', alignItems: 'center'}}>
                {(this.state.searchBarVisible)
                  ? <EvilIcons name={"close"} color={(this.state.searchBarVisible) ? colors.accent : colors.snowWhite} size={26} />
                  : <EvilIcons name={"navicon"} color={colors.snowWhite} size={26} /> }
              </View>
            </TouchableHighlight>

            { /* Title */ }
            <View style={{flex: 0.7, paddingTop: 18, justifyContent: 'center', alignItems: 'center'}}>
              {(!this.state.searchBarVisible)
                ? <Text style={{color: colors.snowWhite, fontSize: 18, backgroundColor: 'transparent'}}>
                    {"My Payments"}
                  </Text>
                : <TextInput
                    autoFocus
                    autoCorrect={false}
                    returnKeyType={"done"}
                    style={{height: 30}}
                    placeholder={"Filter by name or purpose"}
                    placeholderTextColor={colors.slateGrey}
                    onChangeText={(text) => this.state.paymentListRef.filter(text)} /> }
            </View>

            { /* Hamburger / X icon */ }
            <TouchableHighlight
              style={{flex: 0.15}}
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.toggleSearchBar()}>
              <View style={{flex: 1.0, paddingTop: 18, justifyContent: 'center', alignItems: 'center'}}>
                <EvilIcons name={"search"} color={(this.state.searchBarVisible) ? colors.accent : colors.snowWhite} size={26} />
              </View>
            </TouchableHighlight>
          </View>

          { /* StatusCard (header), PayCards (dataSource), TrendingPayments (footer) */ }
          <DynamicList
            data={this.props.currentUser.paymentFlow}
            induceRef={(ref) => this.setState({paymentListRef: ref})}
            renderRow={(rowData, sectionID, rowID) => <PayCard {...this.props} payment={rowData} />}
            renderSectionHeader={(rowData, sectionID) => {
              let numRows = Object.keys(rowData).length
              let title
              
              switch (sectionID) {
                case "in": title = `Incoming Payments (${numRows})`; break;
                case "out": title = `Outgoing Payments (${numRows})`; break;
                default: title = ""
              }

              return(
                <View style={{
                  padding: 7,
                  paddingLeft: dims.width * 0.05,
                  marginTop: 8,
                  backgroundColor: 'rgba(246, 245, 245, 0.94)'
                }}>
                  <Text style={{color: colors.deepBlue, fontSize: 17}}>
                    {title}
                  </Text>
                </View>
              )
            }}
            renderHeader={() => <AlternateStatusCard {...this.props} />}
            renderFooter={() => {
              let data = this.props.currentUser.paymentFlow

              return(
                <View style={{paddingBottom: 100}}>
                  { /* Empty state */
                    (data.in || data.out)
                      ? null
                      : <EmptyState /> }

                  { /* Trending payments button */ }
                  <ExploreTrendingPaymentsButton />
                </View>
              )
            }} />

          { /* Footer */ }
          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', borderTopWidth: 1.0, borderColor: colors.lightGrey, backgroundColor: 'rgba(255, 255, 255, 0.64)', justifyContent: 'space-between'}}>
            <VibrancyView blurType="light" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />

            { /* User button */ }
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.drawer.open()}>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, paddingRight: 20}}>
                  <EvilIcons name={"chevron-left"} size={30} color={colors.slateGrey} style={{marginRight: -5}} />
                  <EvilIcons name={"user"} size={40} color={colors.accent} />
                </View>
              </TouchableHighlight>
            </View>

            { /* New payment button */ }
            <TouchableHighlight
              activeOpacity={0.85}
              underlayColor={'transparent'}
              onPress={() => {
                Actions.GlobalModal({ subcomponent: <PaymentOnboardingView {...this.props} /> })
                this.trackOnce.report("buttonPress/newPayment", this.props.currentUser.uid)
              }}
              style={{padding: 14, paddingRight: 20}}>
              <Animated.View style={{justifyContent: 'center', alignItems: 'center', transform: [{ rotate: this.AV.plusAngle }]}}>
                <EvilIcons name={"plus"} size={40} color={colors.accent} />
              </Animated.View>
            </TouchableHighlight>
          </View>
        </View>
      </Drawer>
    )
  }
}

module.exports = MainView
