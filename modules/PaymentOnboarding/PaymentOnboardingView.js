import React from 'react'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from '../../globalStyles'
import { StickyView } from '../../components'
import { TextField, DateField, UserSearchField } from './subcomponents'
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
      cancelButtonOpacity: new Animated.Value(0)
    }

    this.state = {
      modalVisible: false,
      headerHeight: 0,
      confirming: "",
      who: "",
      selectionMap: {},
      howMuch: "",
      howOften: "",
      howLong: "",
      whatFor: "",
      startDay: "",
      startMonth: "",
      startYear: ""
    }

    this.fieldRefs = {}
    this.induceFieldRef = this.induceFieldRef.bind(this)
    this.toggleFieldFocus = this.toggleFieldFocus.bind(this)
  }

  induceFieldRef(ref) {
    let title = ref.props.title
    this.fieldRefs[title] = ref
  }

  toggleModal() {
    this.setState({modalVisible: true})
  }

  toggleFieldFocus(title) {
    let fieldIsFocused = this.fieldRefs[title].state.focused

    for (var k of Object.keys(this.fieldRefs)) {
      if (k === title) continue
      let curr = this.fieldRefs[k]
      if (fieldIsFocused) curr.hide()
      else curr.show()
    }
  }

  pay() {
    let {
      currentUser
    } = this.props

    let {
      who, howMuch, howOften, howLong, whatFor,
      startDay, startMonth, startYear, confirming
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
        token: currentUser.token
      }

      if (paymentInfo.invite) Lambda.inviteViaPayment(paymentInfo)
      else Lambda.createPayment(paymentInfo)
    }

    // Show success animation, page back to main view
    Animated.parallel(successAnimations).start(() => {
      setTimeout(() => Actions.pop(), 800)
    })
  }

  request() {
    let {
      currentUser
    } = this.props

    let {
      who, howMuch, howOften, howLong, whatFor,
      startDay, startMonth, startYear, confirming
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
        token: currentUser.token
      }

      if (paymentInfo.invite) Lambda.inviteViaPayment(paymentInfo)
      else Lambda.createPayment(paymentInfo)
    }

    // Show success animation, page back to main view
    Animated.parallel(successAnimations).start(() => {
      setTimeout(() => Actions.pop(), 800)
    })
  }

  confirm(payOrRequest) {
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
      })
    ]

    Animated.parallel(confirmAnimations).start()
    this.setState({confirming: (expanding) ? payOrRequest : ""})
  }

  render() {
    let {
      successHeight, successOpacity, buttonOpacity,
      payButtonWidth, requestButtonWidth, payButtonOpacity, requestButtonOpacity,
      cancelButtonWidth, cancelButtonOpacity
    } = this.AV

    let {
      bankAccount
    } = this.props.currentUser

    let {
      confirming
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
              onPress={() => Actions.pop()}
              style={{position: 'absolute', top: 18, bottom: 0, left: 0, padding: 14, justifyContent: 'center'}}>
              <EvilIcons name={"chevron-left"} size={36} color={colors.lightGrey} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Fields */ }
        <ScrollView
          keyboardShouldPersistTaps
          contentContainerStyle={{alignItems: 'center'}}>

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
            validateInput={(input) => {
              return true
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
          <TextField
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
              placeholder: "0 " + ((this.state.howOften === "Monthly") ? "months" : "weeks"),
              keyboardType: "number-pad"
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
              autoCorrect: false
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
            dayValue={this.state.startDay}
            monthValue={this.state.startMonth}
            yearValue={this.state.startYear}
            setValues={(values, cb) => {
              let buffer = values.split("-")
              let day = buffer[0]
              let month = buffer[1]
              let year = buffer[2]

              this.setState({
                startDay: day,
                startMonth: month,
                startYear: year
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
          <Animated.View style={{opacity: buttonOpacity, flexDirection: 'row', alignItems: 'center', height: 75, backgroundColor: colors.lightGrey}}>
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
                  {"Request"}
                </Text>

                { /* Bank account name */
                  (confirming !== "" && bankAccount.name)
                  ? <Text style={{fontSize: 16, color: colors.deepBlue, textAlign: 'center'}}>
                      {"(" + bankAccount.name + ")"}
                    </Text>
                  : null
                }
              </Animated.View>
            </TouchableHighlight>

            { /* Partial border */ }
            <View style={{height: 38, width: (this.state.confirming === "") ? 1 : 0, backgroundColor: colors.medGrey}} />

            { /* 'Pay' button */ }
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => (this.state.confirming === "pay") ? this.pay() : this.confirm("pay")}>
              <Animated.View style={{width: payButtonWidth, opacity: payButtonOpacity, flex: 1.0, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, color: colors.gradientGreen}}>
                  {"Pay"}
                </Text>

                { /* Bank account name */
                  (confirming !== "" && bankAccount.name)
                  ? <Text style={{fontSize: 16, color: colors.deepBlue, textAlign: 'center'}}>
                      {"(" + bankAccount.name + ")"}
                    </Text>
                  : null
                }
              </Animated.View>
            </TouchableHighlight>
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
}

module.exports = PaymentOnboardingView
