import React from 'react'
import moment from 'moment'
import * as _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { View, TouchableHighlight, ListView, ScrollView, RecyclerViewBackedScrollView, Dimensions, Animated, Easing, StatusBar, Text, Image, Modal } from 'react-native'
import { VibrancyView } from "react-native-blur"
import Drawer from 'react-native-drawer'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { colors } from '../../globalStyles'
import { SideMenu, PayCard, NoticeBar, PhotoUploader, MicrodepositOnboarding, TrendingPayments } from '../../components'
import { MyProfile, BankAccounts, Notifications, Invite, Settings } from '../../components/SideMenuSubpages'
import { CreatePaymentView, BankOnboarding } from '../../modules'
import { TrackOnce } from '../../classes/Metrics'
const dims = Dimensions.get('window')

class MainView extends React.Component {
  constructor(props) {
    super(props)

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    let plusAngleInterpolator = new Animated.Value(0)
    let chevronAngleInterpolator = new Animated.Value(0)

    this.animatedValues = {
      filterMenuHeight: new Animated.Value(1),
      chevronAngleInterpolator: chevronAngleInterpolator,
      chevronAngle: chevronAngleInterpolator.interpolate({inputRange: [0, 150], outputRange: ['0deg', '180deg']}),
      plusAngleInterpolator: plusAngleInterpolator,
      plusAngle: plusAngleInterpolator.interpolate({inputRange: [0, 150], outputRange: ['0deg', '135deg']})
    }

    this.headerlessModalTitles = ["retry"]

    this.alreadyGeneratedNoticeBar = {
      inc: false,
      out: false,
      all: false
    }

    this.state = {
      all: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      inc: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      out: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      drawerOpen: false,
      filterMenuOpen: false,
      createPaymentModalVisible: false,
      sideMenuSubpageModalVisible: false,
      activeSideMenuSubpage: null,
      activeFilter: "All"
    }
  }

  componentWillMount() {
    if (this.props.currentUser.endpoints) this.props.currentUser.stopListening()
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.decrypt((updates) => this.props.updateCurrentUser(updates))
    this.props.currentUser.getNativeContacts((updates) => this.props.updateCurrentUser(updates))
    this.trackOnce = new TrackOnce()
  }

  componentWillReceiveProps(nextProps) {
    let payFlowChanged = nextProps.currentUser.paymentFlow !== this.props.currentUser.paymentFlow
    let appFlagsChanged = nextProps.currentUser.appFlags !== this.props.currentUser.appFlags
    if (payFlowChanged || appFlagsChanged) this.generatePayCards(nextProps.currentUser)
  }

  generateNoticeBar(currentUser) {
    let noticeBar = []
    let { appFlags } = currentUser
    let awaitingCustomerVerification = appFlags.customer_status !== "verified"
    let awatingCustomerRetry = appFlags.customer_status === "retry"
    let awaitingMicrodepositVerification = appFlags.onboarding_state === "awaitingMicrodepositVerification"
    let awaitingBankAccount = appFlags.customer_status === "verified" && appFlags.onboarding_state === "bank" || appFlags.customer_status === "documentSuccess"
    let awaitingDocumentUpload = appFlags.customer_status === "document" || appFlags.customer_status === "documentFailure"
    let shouldRenderNoticeBar = awaitingCustomerVerification || awaitingMicrodepositVerification || awaitingBankAccount

    if (shouldRenderNoticeBar) {
      noticeBar.push({
        type: "priorityContent",
        name: "NoticeBar",
        reactComponent:
          <NoticeBar
            dwollaCustomerStatus={appFlags.customer_status}
            onboardingState={appFlags.onboarding_state}
            onPress={() => {
              if (awaitingDocumentUpload) this.toggleSideMenuSubpage("Document Uploader")
              else if (awaitingMicrodepositVerification) this.toggleSideMenuSubpage("Microdeposit Verification")
              else if (awaitingBankAccount) this.toggleSideMenuSubpage("Bank Accounts")
              else if (awatingCustomerRetry) this.toggleSideMenuSubpage("retry")
            }} />
      })
    }

    console.log("--> shouldRenderNoticeBar", shouldRenderNoticeBar)

    return noticeBar
  }

  generateEmptyState() {
    let emptyState = []

    emptyState.push({
      type: "priorityContent",
      name: "EmptyState",
      reactComponent:
        <View style={{alignItems: 'center', justifyContent: 'center', margin: 10, marginTop: 50}}>
          <Text style={{backgroundColor: 'transparent', textAlign: 'center', fontSize: 18, fontWeight: '400', color: colors.richBlack, width: dims.width - 30}}>
             {"When you set up a payment series, it will show up here."}
          </Text>

          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => {{ this.toggleSideMenuSubpage("Trending Payments"); this.trackOnce.report("buttonPress/trendingPayments", this.props.currentUser.uid, { from: "emptyState" }) }}}>
            <View style={{height: 60, backgroundColor: colors.accent, borderRadius: 4, marginTop: 15, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: dims.width / 2}}>
              <Text style={{ fontSize: 18, fontWeight: '400', color: colors.snowWhite, alignSelf: 'center', textAlign: 'center' }}>
                {"Explore Trending Payments"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
    })

    return emptyState
  }

  generatePayCards(currentUser) {
    let payFlow = _.cloneDeep(currentUser.paymentFlow)
    let noticeBar = this.generateNoticeBar(currentUser)
    let emptyState = this.generateEmptyState()

    for (var k of Object.keys(payFlow)) {
      if (payFlow[k].length === 0) payFlow[k] = emptyState
      payFlow[k] = noticeBar.concat(payFlow[k])
    }

    console.log("------------------------------------------------------------------")
    console.log("generatePayCards was invoked")
    console.log("currentUser.paymentFlow", currentUser.paymentFlow)
    console.log("payFlow", payFlow)
    console.log("------------------------------------------------------------------")

    this.setState({
      all: this.EMPTY_DATA_SOURCE.cloneWithRows(payFlow.all),
      inc: this.EMPTY_DATA_SOURCE.cloneWithRows(payFlow.inc),
      out: this.EMPTY_DATA_SOURCE.cloneWithRows(payFlow.out)
    })
  }

  renderRow(rowData) {
    if (typeof rowData === 'undefined')
      return <View />

    switch (rowData.type) {
      case "priorityContent": return rowData.reactComponent
      default: return <PayCard payment={rowData} currentUser={this.props.currentUser} />
    }
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
          toValue: (this.state.filterMenuOpen) ? 75 : 1,
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

  toggleSideMenuSubpage(sp) {
    this.setState({
      activeSideMenuSubpage: sp,
      sideMenuSubpageModalVisible: (sp) ? true : false
    })
  }

  getSideMenuSubpage(sp) {
    switch (sp) {
      case "My Profile": return <MyProfile currentUser={this.props.currentUser} />
      case "Bank Accounts": return <BankAccounts {...this.props} />
      case "Notifications": return <Notifications {...this.props} />
      case "Invite a Friend": return <Invite {...this.props} />
      case "Settings": return <Settings {...this.props} />
      case "Trending Payments": return <TrendingPayments toggleModal={() => this.toggleSideMenuSubpage(null)} title={"Trending Payments"} index={0} currentUser={this.props.currentUser}/>
      case "Document Uploader": return <PhotoUploader toggleModal={() => this.toggleSideMenuSubpage(null)} title={"Secure Document Upload"} type={"document"} index={0} {...this.props} />
      case "Microdeposit Verification": return <MicrodepositOnboarding toggleModal={() => this.toggleSideMenuSubpage(null)} {...this.props} />
      case "retry": return <BankOnboarding retry displayCloseButton currentUser={this.props.currentUser} closeModal={() => this.toggleSideMenuSubpage(null)} />
      default: return <View style={{flex: 1.0, justifyContent: 'center', alignItems: 'center'}}><Text style={{width: dims.width - 80, fontSize: 18, color: colors.accent}}>{"Oops, there's a bug in our code. Let us know at support@getpayper.io"}</Text></View>
    }
  }

  render() {
    let { activeFilter } = this.state
    let dataSource = []

    switch (activeFilter) {
      case "Outgoing": dataSource = this.state.out; break;
      case "Incoming": dataSource = this.state.inc; break;
      case "All": dataSource = this.state.all; break;
    }

    return(
      <Drawer
        type={"overlay"}
        openDrawerOffset={80}
        ref={(ref) => this.drawer = ref}
        tapToClose
        tweenDuration={100}
        onOpenStart={() => this.rotateToX()}
        onCloseStart={() => this.rotateToPlus()}
        content={<SideMenu {...this.props} toggleSideMenuSubpage={(p) => this.toggleSideMenuSubpage(p)} />}>

        <View style={{flex: 1.0, backgroundColor: colors.lightGrey}}>
          <StatusBar barStyle={"light-content"} />

          { /* Header */ }
          <View style={{overflow: 'hidden'}}>
            <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.toggleFilterMenu()}>
              <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                  {this.state.activeFilter + " Payments"}
                </Text>

                <Animated.View style={{position: 'absolute', top: 0, right: 6, paddingTop: 24, backgroundColor: 'transparent'}}>
                  <Animated.View style={{ transform: [{ rotate: this.animatedValues.chevronAngle }] }}>
                    <EvilIcons name={"chevron-down"} size={34} color={colors.lightGrey} />
                  </Animated.View>
                </Animated.View>
              </View>
            </TouchableHighlight>
          </View>

          <Animated.View style={{height: this.animatedValues.filterMenuHeight, backgroundColor: colors.snowWhite, overflow: 'hidden'}}>
            <ScrollView horizontal contentContainerStyle={{flex: 1.0, paddingLeft: 12, paddingRight: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              { /* All */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('All')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"eye"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"All"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Outgoing */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('Outgoing')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"arrow-up"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Outgoing"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Incoming */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => this.toggleFilter('Incoming')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"arrow-down"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Incoming"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* Soonest
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={colors.maastrichtBlue}
                onPress={() => this.toggleFilter('Soonest')}>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <EvilIcons name={"calendar"} size={38} color={colors.accent} />
                  <Text style={{color: colors.maastrichtBlue, fontSize: 16}}>
                    {"Soonest"}
                  </Text>
                </View>
              </TouchableHighlight> */ }
            </ScrollView>
          </Animated.View>

          { /* Banner info and payment list */ }
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            renderFooter={() => <View style={{height: 90}} />}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />

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
              onPress={() => {Actions.PaymentOnboardingView({currentUser: this.props.currentUser}); this.trackOnce.report("buttonPress/newPayment", this.props.currentUser.uid); }}
              style={{padding: 14, paddingRight: 20}}>
              <Animated.View style={{justifyContent: 'center', alignItems: 'center', transform: [{ rotate: this.animatedValues.plusAngle }]}}>
                <EvilIcons name={"plus"} size={40} color={colors.accent} />
              </Animated.View>
            </TouchableHighlight>
          </View>

          { /* Create payment modal */ }
          <Modal animationType={"slide"} visible={this.state.createPaymentModalVisible}>
            <CreatePaymentView
              {...this.props}
              toggleModal={() => this.setState({createPaymentModalVisible: false})} />
          </Modal>


          { /* Side menu page modal */ }
          <Modal animationType={"slide"} transparent={true} visible={this.state.sideMenuSubpageModalVisible}>
            <View style={{flex: 1.0}}>

              { /* Header */
                (this.headerlessModalTitles.includes(this.state.activeSideMenuSubpage))
                ? null
                : <View style={{overflow: 'hidden'}}>
                    <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
                    <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                      <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                        {this.state.activeSideMenuSubpage}
                      </Text>

                      <TouchableHighlight
                        activeOpacity={0.75}
                        underlayColor={'transparent'}
                        style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
                        onPress={() => this.toggleSideMenuSubpage(null)}>
                        <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
                      </TouchableHighlight>
                    </View>
                  </View>
              }

              { /* Inner content */ }
              <View style={{flex: 1.0}}>
                {this.getSideMenuSubpage(this.state.activeSideMenuSubpage)}
              </View>
            </View>
          </Modal>
        </View>
      </Drawer>
    )
  }
}

module.exports = MainView
