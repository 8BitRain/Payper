import React from 'react'
import moment from 'moment'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from '../../globalStyles'
import { StickyView, TrendingPayments } from '../../components'
import { TextField, FrequencyField, DateField, UserSearchField } from './subcomponents'
import { Timer } from '../../classes/Metrics'
import * as Lambda from '../../services/Lambda'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class PaymentOnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      successHeight: new Animated.Value(75),
      successOpacity: new Animated.Value(0),
      buttonOpacity: new Animated.Value(1),
      payButtonWidth: new Animated.Value(dims.width * 0.5),
      requestButtonWidth: new Animated.Value(dims.width * 0.5),
      payButtonOpacity: new Animated.Value(dims.width * 1.0),
      requestButtonOpacity: new Animated.Value(dims.width * 1.0),
      cancelButtonWidth: new Animated.Value(0),
      cancelButtonOpacity: new Animated.Value(0),
      exploreButtonHeight: new Animated.Value(60),
      exploreButtonOpacity: new Animated.Value(1),
      exploreButtonMarginTop: new Animated.Value(15),
      exploreButtonPadding: new Animated.Value(8)
    }

    this.fieldNames = ['Who?', 'How much?', 'How often?', 'How long?', 'What for?', 'Starting when?']

    let now = new Date()
    let day = now.getDate()
    let month = now.getMonth() + 1
    let year = now.getFullYear()

    this.state = {
      submittable: true,
      cancellable: true,
      modalVisible: false,
      headerHeight: 0,
      selectionMap: {},
      scrollTop: 0,
      inFlow: false,
      haventFocusedAFieldYet: true,
      confirming: "",
      who: "",
      howMuch: "",
      howOften: "",
      howLong: "",
      whatFor: "",
      startDay: day,
      startMonth: month,
      startYear: year,
      startUTCString: ""
    }

    this.fieldRefs = {}
    this.induceFieldRef = this.induceFieldRef.bind(this)
    this.toggleFieldFocus = this.toggleFieldFocus.bind(this)
  }

  componentWillMount() {
    this.timer = new Timer()
    this.timer.start()
  }

  induceFieldRef(ref) {
    let title = ref.props.title
    this.fieldRefs[title] = ref
  }

  toggleModal() {
    this.setState({modalVisible: true})
  }

  toggleFlow() {
    this.setState({inFlow: !this.state.inFlow})
  }

  toggleFieldFocus(title, shouldContinueFlow) {
    let {scrollTop, scrollTopCache, inFlow, haventFocusedAFieldYet} = this.state
    let fieldIsFocused = this.fieldRefs[title].state.focused

    // If the first field opened is 'Who?', start flow
    if (fieldIsFocused && title === "Who?" && haventFocusedAFieldYet)
      this.setState({inFlow: true})

    // We've focused a field. Flow cannot be initiated again
    if (fieldIsFocused && haventFocusedAFieldYet)
      this.setState({haventFocusedAFieldYet: false})

    // Continue flow
    if (inFlow && shouldContinueFlow) {
      let nextFieldIndex = this.fieldNames.indexOf(title) + 1

      if (nextFieldIndex < this.fieldNames.length) {
        let nextFieldTitle = this.fieldNames[nextFieldIndex]
        let nextField = this.fieldRefs[nextFieldTitle]

        setTimeout(() => {
          nextField.toggle()
          this.toggleExploreButton("hide")
        }, 250)
      }
    }

    // Break flow if input was cancelled, or if we've reached the end
    let inputWasCancelled = !fieldIsFocused && shouldContinueFlow === false
    let endOfFlowWasReached = !fieldIsFocused && title === "Starting when?"
    if (inputWasCancelled || endOfFlowWasReached) this.setState({inFlow: false})

    // Show or hide 'Explore Trending Payments' button
    this.toggleExploreButton()

    // Scroll to cached scrollTop
    if (fieldIsFocused) {
      // We're focusing; record scrollTop position to return to on unfocus
      this.setState({scrollTopCache: scrollTop})
    } else {
      // We're unfocusing; scroll to previous scrollTop position
      this.ScrollView.scrollTo({y: scrollTopCache, animated: false})
    }

    // Show or hide input fields
    for (var k of Object.keys(this.fieldRefs)) {
      if (k === title) continue
      let curr = this.fieldRefs[k]

      // Toggle field visiblity
      if (fieldIsFocused) curr.hide()
      else curr.show()
    }
  }

  toggleExploreButton(override) {
    let {
      exploreButtonHeight, exploreButtonOpacity, exploreButtonMarginTop,
      exploreButtonPadding
    } = this.AV

    let animations = [
      Animated.timing(exploreButtonHeight, {
        toValue: (exploreButtonHeight._value === 0 && override !== "hide") ? 60 : 0,
        duration: 200
      }),
      Animated.timing(exploreButtonOpacity, {
        toValue: (exploreButtonOpacity._value === 0 && override !== "hide") ? 1 : 0,
        duration: 160
      }),
      Animated.timing(exploreButtonMarginTop, {
        toValue: (exploreButtonMarginTop._value === 0 && override !== "hide") ? 15 : 0,
        duration: 200
      }),
      Animated.timing(exploreButtonPadding, {
        toValue: (exploreButtonPadding._value === 0 && override !== "hide") ? 8 : 0,
        duration: 200
      })
    ]

    Animated.parallel(animations).start()
  }

  pay() {
    if (!this.state.submittable) return
    this.setState({submittable: false})

    let {
      currentUser
    } = this.props

    let {
      who, howMuch, howOften, howLong, whatFor,
      startDay, startMonth, startYear, startUTCString,
      confirming
    } = this.state

    let {
      successHeight, successOpacity, buttonOpacity
    } = this.AV

    // Format success animations
    let successAnimations = [
      Animated.timing(successHeight, {
        toValue: dims.height * 0.2,
        duration: 180
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 120
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 100
      })
    ]

    // Format and send payments
    for (var k in who) {
      let user = who[k]
      let thisUser = currentUser.getPaymentAttributes()
      let otherUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        profile_pic: user.profile_pic,
        username: user.username,
        uid: user.uid,
        phone: user.phone
      }
      let paymentInfo = {
        sender: thisUser,
        recip: otherUser,
        invite: (otherUser.uid) ? false : true,
        phoneNumber: otherUser.phone,
        invitee: "recip",
        amount: (howMuch.indexOf("$") >= 0) ? howMuch.slice(1) : howMuch,
        frequency: howOften.toUpperCase(),
        payments: howLong.split(" ")[0],
        purpose: whatFor,
        type: "payment",
        token: currentUser.token,
        start: startUTCString
      }

      if (paymentInfo.invite) Lambda.inviteViaPayment(paymentInfo)
      else Lambda.createPayment(paymentInfo)
    }

    // Show success animation, page back to main view
    Animated.parallel(successAnimations).start(() => {

      // Determine alert to show after scene pop, if any
      var recipients = ""
      if (who.length === 1) {
        recipients = who[0].first_name
      } else if (who.length === 2) {
        recipients = who[0].first_name + " and " + who[1].first_name
      } else {
        for (var i = 0; i < who.length; i++) {
          let curr = who[i]
          recipients += (i < who.length - 1)
            ? curr.first_name + ", "
            : "and " + curr.first_name
        }
      }

      var alertTitle = (currentUser.appFlags.onboardingProgress === "need-bank")
        ? "Bank Account Needed"
        : null
      var alertMsg = (currentUser.appFlags.onboardingProgress === "need-bank")
        ? `Your payments to ${recipients} won't commence until you've added a bank account.`
        : null

      // Pop back to MainView and alert if need be
      setTimeout(() => {
        Actions.pop()
        if (alertTitle && alertMsg) {
          Actions.refresh({
            cb: () => setTimeout(() => {
              Alert.alert(alertTitle, alertMsg,
                [
                  {text: 'Dismiss', style: 'cancel'},
                  {text: 'Add Bank', onPress: () => {
                    const IAVWebView = require('../../components/IAVWebView/IAVWebView')

                    Actions.GlobalModal({
                     subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
                     backgroundColor: colors.accent
                   })
                  }},
                ]
              )
            }, 800)
          })
        }
      }, 800)
    })

    this.timer.report("paymentOnboarding", this.props.currentUser.uid, {
      cancelled: false
    })
  }

  request() {
    if (!this.state.submittable) return
    this.setState({submittable: false})

    let {
      currentUser
    } = this.props

    let {
      who, howMuch, howOften, howLong, whatFor,
      startDay, startMonth, startYear, startUTCString,
      confirming
    } = this.state

    let {
      successHeight, successOpacity, buttonOpacity
    } = this.AV

    // Format success animations
    let successAnimations = [
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 120
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 100
      })
    ]

    // Format and send payments
    for (var k in who) {
      let user = who[k]
      let thisUser = currentUser.getPaymentAttributes()
      let otherUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        profile_pic: user.profile_pic,
        username: user.username,
        uid: user.uid,
        phone: user.phone
      }
      let paymentInfo = {
        sender: otherUser,
        recip: thisUser,
        invite: (otherUser.uid) ? false : true,
        phoneNumber: otherUser.phone,
        invitee: "sender",
        amount: (howMuch.indexOf("$") >= 0) ? howMuch.slice(1) : howMuch,
        frequency: howOften.toUpperCase(),
        payments: howLong.split(" ")[0],
        purpose: whatFor,
        type: "request",
        token: currentUser.token,
        start: startUTCString
      }

      if (paymentInfo.invite) Lambda.inviteViaPayment(paymentInfo)
      else Lambda.createPayment(paymentInfo)
    }

    // Show success animation, page back to main view
    Animated.parallel(successAnimations).start(() => {
      // Determine alert to show after scene pop, if any
      var recipients = ""
      if (who.length === 1) {
        recipients = who[0].first_name
      } else if (who.length === 2) {
        recipients = who[0].first_name + " and " + who[1].first_name
      } else {
        for (var i = 0; i < who.length; i++) {
          let curr = who[i]
          recipients += (i < who.length - 1)
            ? curr.first_name + ", "
            : "and " + curr.first_name
        }
      }

      let userNeedsBank = currentUser.appFlags.onboardingProgress === "need-bank"
        || currentUser.appFlags.onboardingProgress.indexOf("microdeposits") >= 0
      let userNeedsToVerify = currentUser.appFlags.customer_status !== "verified"

      var alertMsg, alertTitle
      if (userNeedsBank && userNeedsToVerify) {
        alertTitle = "Bank and Verification Needed"
        alertMsg = `Your payments from ${recipients} won't commence until you've added a bank account and verified your account.`
      } else if (userNeedsBank) {
        alertTitle = "Bank Account Needed"
        alertMsg = `Your payments from ${recipients} won't commence until you've added a bank account.`
      } else if (userNeedsToVerify) {
        alertTitle = "Verification Needed"
        alertMsg = `Your payments from ${recipients} won't commence until you've verified your account.`
      }

      // Pop back to MainView and alert if need be
      setTimeout(() => {
        Actions.pop()
        if (alertTitle && alertMsg) {
          Actions.refresh({
            cb: () => setTimeout(() => {
              Alert.alert(alertTitle, alertMsg,
                [
                  {text: 'Dismiss', style: 'cancel'},
                  (userNeedsBank)
                    ? {text: 'Add Bank', onPress: () => {
                        const IAVWebView = require('../../components/IAVWebView/IAVWebView')

                        Actions.GlobalModal({
                         subcomponent: <IAVWebView refreshable currentUser={this.props.currentUser} />,
                         backgroundColor: colors.accent
                        })
                      }}
                    : {text: 'Verify Account', onPress: () => {
                      const KYCOnboardingView = require('../../components/KYCOnboarding/KYCOnboardingView')

                      Actions.GlobalModal({
                        subcomponent: <KYCOnboardingView currentUser={this.props.currentUser} />,
                        backgroundColor: colors.snowWhite,
                        showHeader: true,
                        title: "Account Verification"
                      })
                    }}
                ]
              )
            }, 800)
          })
        }
      }, 800)
    })

    this.timer.report("paymentOnboarding", this.props.currentUser.uid, {
      cancelled: false
    })
  }

  confirm(payOrRequest) {
    // Make sure no fields are blank
    let {
      who, howMuch, howOften, howLong, whatFor, startDay, startMonth, startYear
    } = this.state

    let fields = [who, howMuch, howOften, howLong, whatFor, startDay, startMonth, startYear]

    // Validate existence of all inputs
    for (var i in fields) {
      let curr = fields[i]
      if (curr === "") {
        Alert.alert("Wait!", "Please fill out all fields.")
        return
      }
    }

    // Valid 'who' (existence of the array doesn't mean it has anything inside)
    if (Array.isArray(who) && who.length < 1) {
      Alert.alert("Wait!", "Please fill out all fields.")
      return
    }

    let {
      successHeight, successOpacity, buttonOpacity,
      payButtonWidth, requestButtonWidth, payButtonOpacity, requestButtonOpacity,
      cancelButtonWidth, cancelButtonOpacity
    } = this.AV

    let expanding = this.state.confirming === ""
    let pressedButtonWidth = (payOrRequest === "pay") ? payButtonWidth : requestButtonWidth
    let otherButtonWidth = (payOrRequest === "pay") ? requestButtonWidth : payButtonWidth
    let otherButtonOpacity = (payOrRequest === "pay") ? requestButtonOpacity : payButtonOpacity

    let confirmAnimations = [
      Animated.timing(pressedButtonWidth, {
        toValue: (expanding) ? dims.width * 0.8 : dims.width * 0.5,
        duration: 140
      }),
      Animated.timing(otherButtonWidth, {
        toValue: (expanding) ? 0 : dims.width * 0.5,
        duration: 140
      }),
      Animated.timing(cancelButtonWidth, {
        toValue: (expanding) ? dims.width * 0.2 : 0,
        duration: 140
      }),
      Animated.timing(otherButtonOpacity, {
        toValue: (expanding) ? 0 : 1,
        duration: 40
      }),
      Animated.timing(cancelButtonOpacity, {
        toValue: (expanding) ? 1 : 0,
        duration: 40
      }),
      Animated.timing(successHeight, {
        toValue: (expanding) ? dims.height * 0.2 : 75,
        duration: 180
      })
    ]

    Animated.parallel(confirmAnimations).start()
    this.setState({confirming: (expanding) ? payOrRequest : ""})
  }

  toggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  cancel() {
    if (!this.state.cancellable) return

    this.setState({cancellable: false})

    this.timer.report("paymentOnboarding", this.props.currentUser.uid, {
      cancelled: true,
      stateSnapshot: this.state
    })

    Actions.pop()
  }

  render() {
    let {
      successHeight, successOpacity, buttonOpacity,
      payButtonWidth, requestButtonWidth, payButtonOpacity, requestButtonOpacity,
      cancelButtonWidth, cancelButtonOpacity,
      exploreButtonHeight, exploreButtonOpacity, exploreButtonMarginTop,
      exploreButtonPadding
    } = this.AV

    let {
      bankAccount
    } = this.props.currentUser

    let {
      confirming, howMuch, howLong, howOften
    } = this.state

    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <View style={{overflow: 'hidden'}} onLayout={(e) => this.setState({headerHeight: e.nativeEvent.layout.height})}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

          <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
              {"New Payment Series"}
            </Text>

            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => this.cancel()}
              style={{position: 'absolute', top: 18, bottom: 0, left: 0, padding: 14, justifyContent: 'center'}}>
              <EvilIcons name={"close"} size={24} color={colors.snowWhite} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Fields */ }
        <ScrollView
          ref={ref => this.ScrollView = ref}
          onScroll={(e) => this.setState({scrollTop: e.nativeEvent.contentOffset.y})}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps
          contentContainerStyle={{alignItems: 'center'}}>

          { /* 'Explore' link */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.toggleModal()}>
            <Animated.View
              style={{
                height: exploreButtonHeight, opacity: exploreButtonOpacity, padding: exploreButtonPadding, marginTop: exploreButtonMarginTop,
                backgroundColor: colors.lightGrey, borderRadius: 4, justifyContent: 'center', alignItems: 'center'
              }}>
              <Text style={{color: colors.slateGrey, fontSize: 14, backgroundColor: 'transparent', textAlign: 'center'}}>
                {"Curious what others are using Payper for?"}
                <Text style={{color: colors.accent}}>
                  {" Explore Trending Payments"}
                </Text>
              </Text>
            </Animated.View>
          </TouchableHighlight>

          { /* Who? */ }
          <UserSearchField
            currentUser={this.props.currentUser}
            title={"Who?"}
            iconName={"user"}
            complete={false}
            value={this.state.who}
            selectionMap={this.state.selectionMap}
            offsetTop={this.state.headerHeight}
            invalidityAlert={"Please select one or more users."}
            textInputProps={{
              placeholder: "Search by name or username",
              keyboardType: "default",
              autoCapitalize: "words",
              autoCorrect: false
            }}
            setValue={(values, cb) => {
              this.setState({who: values.selectedUsers, selectionMap: values.selectionMap})
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* How much? */ }
          <TextField
            title={"How much?"}
            iconName={"tag"}
            complete={false}
            value={this.state.howMuch}
            invalidityAlert={"Please enter an amount between $1 and $3,000."}
            textInputProps={{
              placeholder: "$0.00",
              keyboardType: "numeric"
            }}
            validateInput={(input) => {
              let string = input.replace(/[^\d\.]*/g, '')
              let float = parseFloat(string)
              let isValid = float >= 1 && float <= 3000
              return isValid
            }}
            setValue={(value, cb) => {
              let string = value.replace(/[^\d\.]*/g, '')
              let float = parseFloat(string)
              let formatted = ""

              if (string.indexOf('.') >= 0) float = float.toFixed(2)
              formatted = "$" + float.toLocaleString()

              this.setState({howMuch: formatted}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* How often? */ }
          <FrequencyField
            title={"How often?"}
            iconName={"clock"}
            complete={false}
            value={this.state.howOften}
            invalidityAlert={"Please enter a valid frequency (monthly or weekly)."}
            textInputProps={{
              placeholder: "Monthly or weekly?",
              keyboardType: "default",
              autoCapitalize: "words",
              autoCorrect: false
            }}
            validateInput={(input) => {
              input = input.toLowerCase()
              let isValid = input.indexOf("month") >= 0 || input.indexOf("week") >= 0
              return isValid
            }}
            setValue={(value, cb) => {
              // Reformat value
              value = value.toLowerCase()
              if (value.indexOf("month") >= 0) value = "Monthly"
              else if (value.indexOf("week") >= 0) value = "Weekly"

              // Update duration
              let {howLong} = this.state
              if (howLong !== "") {
                let buffer = howLong.split(" ")
                let duration = buffer[0]

                // Determine frequency to be appended
                let frequency = ""
                if (value === "Monthly")
                  frequency = (duration === 1) ? " month" : " months"
                else if (value === "Weekly")
                  frequency = (duration === 1) ? " week" : " weeks"

                duration += frequency
                this.setState({howLong: duration})
              }

              this.setState({howOften: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* How long? */ }
          <TextField
            title={"How long?"}
            iconName={"calendar"}
            complete={false}
            value={this.state.howLong}
            invalidityAlert={"Please enter a valid duration (1 or more " + ((this.state.howOften === "Monthly") ? "months" : "weeks") + ")"}
            textInputProps={{
              placeholder: "0 " + ((this.state.howOften === "Monthly") ? "(months)" : "(weeks)"),
              keyboardType: "number-pad",
              defaultValue: this.state.howLong.split(" ")[0]
            }}
            validateInput={(input) => {
              return true
            }}
            setValue={(value, cb) => {
              value = value.split(" ")[0]
              let {howOften} = this.state

              // Determine freqency to be appended
              let frequency = ""
              if (this.state.howOften === "Monthly")
                frequency = (value === 1) ? " month" : " months"
              else if (this.state.howOften === "Weekly")
                frequency = (value === 1) ? " week" : " weeks"

              value += frequency

              this.setState({howLong: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* What for? */ }
          <TextField
            title={"What for?"}
            iconName={"pencil"}
            complete={false}
            value={this.state.whatFor}
            invalidityAlert={"Please enter a payment purpose."}
            textInputProps={{
              placeholder: "ex. Spotify Family Plan",
              keyboardType: "default",
              autoCorrect: false,
              maxLength: 30
            }}
            validateInput={(input) => {
              return input.length > 0
            }}
            setValue={(value, cb) => {
              this.setState({whatFor: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Starting when? */ }
          <DateField
            title={"Starting when?"}
            iconName={"clock"}
            complete={false}
            dayValue={this.state.startDay.toString()}
            monthValue={this.state.startMonth.toString()}
            yearValue={this.state.startYear.toString()}
            setValues={(values, cb) => {
              let buffer = values.split("-")
              let day = buffer[1]
              let month = buffer[0]
              let year = buffer[2]

              // Determine whether start date is today
              let now = moment()
              let then = moment(values, "MM-DD-YYYY")
              let inputIsToday = now.isSame(then, 'day')

              // Set up date time
              let dateTimeFormat = 'MM-DD-YYYY hh:mm:ss a'
              let dateTime = values + " 08:30:00 AM"

              let utcString

              // If start date is today, first payment should happen in 5
              // minutes
              if (inputIsToday) {
                let fiveMinutesFromNow = now.add(5, 'minutes')
                utcString = fiveMinutesFromNow.utc().valueOf()
              }

              // Otherwise, first payment should happen at 8:30AM on the start
              // date
              else {
                let formattedDateTime = moment(dateTime, dateTimeFormat)
                utcString = formattedDateTime.utc().valueOf()
              }

              this.setState({
                startDay: day,
                startMonth: month,
                startYear: year,
                startUTCString: utcString
              }, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* Footer (fill) */ }
          <View style={{width: dims.width, height: 90}} />

        </ScrollView>

        { /* Pay and request buttons */ }
        <Animated.View
          style={{
            height: successHeight, position: 'absolute', bottom: 0, left: 0, right: 0,
            shadowOpacity: 0.2, shadowRadius: 11, shadowOffset: { height: 0, width: 0 }
          }}>

          { /* Success message */ }
          <Animated.View
            style={{
              opacity: successOpacity, position: 'absolute', top: 0, right: 0,
              bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center',
              backgroundColor: colors.gradientGreen
            }}>
            <EvilIcons name={"check"} color={colors.snowWhite} size={68} />
          </Animated.View>

          { /* Pay and request buttons */ }
          <Animated.View style={{opacity: buttonOpacity, flexDirection: 'row', flex: 1.0, alignItems: 'center', backgroundColor: colors.lightGrey}}>
            { /* Cancel button */ }
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.confirm(this.state.confirming)}>
              <Animated.View style={{flexDirection: 'row', width: cancelButtonWidth, opacity: cancelButtonOpacity, flex: 1.0, alignItems: 'center', justifyContent: 'center'}}>
                <EvilIcons name={"close-o"} color={colors.carminePink} size={26} />

                { /* Partial border */ }
                <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center'}}>
                  <View style={{height: 38, width: 1, backgroundColor: colors.medGrey}} />
                </View>
              </Animated.View>
            </TouchableHighlight>

            { /* 'Request' button */ }
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => (confirming === "request") ? this.request() : this.confirm("request")}>
              <Animated.View style={{width: requestButtonWidth, opacity: requestButtonOpacity, flex: 1.0, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, color: colors.accent, textAlign: 'center'}}>
                  {(confirming === "request") ? "Confirm Request" : "Request"}
                </Text>

                { /* Payment summary */
                  (confirming !== "")
                    ? <Text style={{fontSize: 14, color: colors.deepBlue, textAlign: 'center', paddingTop: 3}}>
                        {howMuch + " per " + ((howOften === "Weekly") ? "week" : "month") + " for " + howLong}
                      </Text>
                    : null
                }

                { /* Bank account name */
                  (confirming !== "" && bankAccount && bankAccount.name)
                    ? <Text style={{fontSize: 14, color: colors.deepBlue, textAlign: 'center'}}>
                        {"(Bank: " + ((bankAccount.name.length > 14) ? bankAccount.name.substring(0, 13).trim().concat("...") : bankAccount.name) + ")"}
                      </Text>
                    : null
                }
              </Animated.View>
            </TouchableHighlight>

            { /* Partial border */ }
            <View style={{height: 38, width: (this.state.confirming === "") ? 1 : 0, backgroundColor: colors.slateGrey}} />

            { /* 'Pay' button */ }
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => (this.state.confirming === "pay") ? this.pay() : this.confirm("pay")}>
              <Animated.View style={{width: payButtonWidth, opacity: payButtonOpacity, flex: 1.0, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, color: colors.gradientGreen}}>
                  {(confirming === "pay") ? "Confirm Pay" : "Pay"}
                </Text>

                { /* Payment summary */
                  (confirming !== "")
                    ? <Text style={{fontSize: 14, color: colors.deepBlue, textAlign: 'center', paddingTop: 3}}>
                        {howMuch + " per " + ((howOften === "Weekly") ? "week" : "month") + " for " + howLong}
                      </Text>
                    : null
                }

                { /* Bank account name */
                  (confirming !== "" && bankAccount && bankAccount.name)
                    ? <Text style={{fontSize: 14, color: colors.deepBlue, textAlign: 'center'}}>
                        {"(Bank: " + ((bankAccount.name.length > 14) ? bankAccount.name.substring(0, 13).trim().concat("...") : bankAccount.name) + ")"}
                      </Text>
                    : null
                }
              </Animated.View>
            </TouchableHighlight>
          </Animated.View>
        </Animated.View>

        { /* Trending Payments Modal */ }
        <Modal animationType={"slide"} visible={this.state.modalVisible}>
          <View style={{flex: 1.0}}>
            { /* Header */ }
            <View style={{overflow: 'hidden'}}>
              <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
              <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                  {"Trending Payments"}
                </Text>

                <TouchableHighlight
                  activeOpacity={0.75}
                  underlayColor={'transparent'}
                  style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
                  onPress={() => this.toggleModal()}>
                  <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
                </TouchableHighlight>
              </View>
            </View>

            { /* Content */ }
            <TrendingPayments currentUser={this.props.currentUser} />
          </View>
        </Modal>
      </View>
    )
  }
}

module.exports = PaymentOnboardingView
