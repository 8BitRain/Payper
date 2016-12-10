import React from 'react'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { colors } from '../../globalStyles'
import { StickyView } from '../../components'
import { TextField, DateField } from './subcomponents'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class PaymentOnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      who: "",
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

  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <View style={{overflow: 'hidden'}}>
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
          <TextField
            title={"Who?"}
            iconName={"user"}
            complete={false}
            value={this.state.who}
            invalidityAlert={"Please select one or more users."}
            textInputProps={{
              placeholder: "Search by name or number",
              keyboardType: "default",
              autoCapitalize: "words",
              autoCorrect: false
            }}
            validateInput={(input) => {
              return true
            }}
            setValue={(value, cb) => {
              this.setState({who: value}, () => cb())
            }}
            induceFieldRef={this.induceFieldRef}
            toggleFieldFocus={this.toggleFieldFocus} />

          { /* How much? */ }
          <TextField
            title={"How much?"}
            iconName={"credit-card"}
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

        </ScrollView>
      </View>
    )
  }
}

module.exports = PaymentOnboardingView
