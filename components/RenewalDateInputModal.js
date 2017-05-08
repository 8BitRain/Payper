import React from 'react'
import moment from 'moment'
import {View, Text, StyleSheet, TextInput, Alert, Dimensions, TouchableHighlight, Modal} from 'react-native'
import {colors} from '../globalStyles'
import {Header, ContinueButton, StickyView} from './'
import {DateField} from './Inputs'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

class RenewalDateInputModal extends React.Component {
  constructor(props) {
    super(props)

    this.months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    this.numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    this.soonestPossibleRenewalDate = new moment(new Date()).add(1, (props.broadcast.freq === 'MONTHLY') ? 'month' : 'week').utc()

    this.state = {
      day: "",
      month: "",
      year: "",
      timestamp: null
    }
  }

  autoFillWithASAPDate() {
    let asap = new Date(this.soonestPossibleRenewalDate)
    let day = asap.getDate().toString()
    let month = (asap.getMonth() + 1).toString()
    let year = asap.getFullYear().toString()
    this.setState({day, month, year, timestamp: this.soonestPossibleRenewalDate.format('x')}, () => this.yearField.focus())
  }

  submit() {
    let {day, month, year, timestamp} = this.state
    let input = month + "-" + day + "-" + year

    // Validate input
    let {inputIsValid, errorMessage, fieldToFocus} = this.validateInput(input)
    if (!inputIsValid) {
      let title = "Wait!"
      let msg = errorMessage || "Input is invalid."
      Alert.alert(title, msg, [{text: 'OK', onPress: () => (this[fieldToFocus]) ? this[fieldToFocus].focus() : null}])
      return
    }

    // Return timestamp to caller
    this.props.onSubmit(timestamp)
  }

  validateInput(input) {
    let buffer = input.split("-")
    let dayString = buffer[1]
    let monthString = buffer[0]
    let yearString = buffer[2]
    let dayFloat = parseFloat(dayString)
    let monthFloat = parseFloat(monthString)
    let yearFloat = parseFloat(yearString)
    let monthIndex = monthFloat - 1

    // Validate length of time between now and start date
    let dateFormat = 'MM-DD-YYYY'
    let nowMoment = moment()
    let inputMoment = moment(input, dateFormat)
    let dateIsInFuture = inputMoment.isSameOrAfter(this.soonestPossibleRenewalDate, 'day')

    // Validate day
    let dayExceedsMaximum = dayFloat > this.numDaysInMonth[monthIndex]
    let dayIsZero = dayFloat < 1
    let dayIsValid = !dayExceedsMaximum && !dayIsZero

    // Validate month
    let monthExceedsMaximum = monthFloat > 12
    let monthIsZero = monthFloat < 1
    let monthIsValid = !monthExceedsMaximum && !monthIsZero

    // Compile validations
    let isValid = dayIsValid && monthIsValid && dateIsInFuture

    // If invalid, determine which error to display
    let errorMessage, fieldToFocus
    if (!isValid) {
      // Month is invalid
      if (!monthIsValid) {
        errorMessage = "Month is invalid."
        fieldToFocus = "monthField"
      }

      // Day is invalid
      else if (!dayIsValid) {
        if (dayExceedsMaximum) {
          let max = this.numDaysInMonth[monthIndex]
          errorMessage = "There are only " + max + " days in " + this.months[monthIndex] + "."
          fieldToFocus = "dayField"
        } else if (dayIsZero) {
          errorMessage = "0 is not a validate day."
          fieldToFocus = "dayField"
        }
      }

      // Date is not in the future
      else if (!dateIsInFuture) {
        errorMessage = `Renewal must be at least a ${(this.props.broadcast.freq === 'MONTHLY') ? 'month' : 'week'} from the last renewal date.`
        fieldToFocus = "yearField"
      }
    }

    return {inputIsValid: isValid, errorMessage: errorMessage, fieldToFocus: fieldToFocus}
  }

  onChangeText(input) {
    let key = Object.keys(input)[0]
    let val = input[key]

    // Should input focus shift from month to day?
    let monthIsTwoDigits = key === "month" && val.length === 2
    let monthCannotBeMoreThanOneDigit = key === "month" && val.length === 1 && val >= 3
    let shouldShiftFromMonthToDay = monthIsTwoDigits || monthCannotBeMoreThanOneDigit

    // Should input focus shift from day to year?
    let dayIsTwoDigits = key === "day" && val.length === 2
    let dayCannotBeMoreThanOneDigit = key === "day" && val.length === 1 && val >= 4
    let shouldShiftFromDayToYear = dayIsTwoDigits || dayCannotBeMoreThanOneDigit

    if (shouldShiftFromMonthToDay) this.dayField.focus()
    else if (shouldShiftFromDayToYear) this.yearField.focus()

    this.setState(input)
  }

  render() {
    return(
      <Modal visible={this.props.visible} animationType={"slide"}>
        <View style={styles.container}>

          { /* Input sticks to top of keyboard */ }
          <StickyView duration={0}>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: dims.width, backgroundColor: colors.lightGrey, padding: 10, paddingBottom: 0}}>
              <View style={{flex: 0.3333}} />
              <View style={{flex: 0.3333, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, color: colors.deepBlue}}>
                  {"Renewal Date"}
                </Text>
              </View>
              <View style={{flex: 0.3333}}>
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.autoFillWithASAPDate()}>
                  <View style={{flex: 1.0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: colors.accent, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, borderRadius: 4, backgroundColor: colors.snowWhite, overflow: 'hidden'}}>
                      {"ASAP"}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
              { /* Cancel button */ }
              <TouchableHighlight
                activeOpacity={0.65}
                underlayColor={'transparent'}
                onPress={this.props.cancel}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                  <EvilIcons name={"close-o"} size={38} color={colors.carminePink} />
                  <View style={{position: 'absolute', top: 10, bottom: 10, right: 0, width: 1, backgroundColor: colors.medGrey}} />
                </View>
              </TouchableHighlight>

              <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.65, height: 50}}>
                { /* Month input */ }
                <TextInput
                  ref={ref => this.monthField = ref}
                  defaultValue={this.state.month}
                  placeholder={"MM"}
                  placeholderTextColor={colors.slateGrey}
                  keyboardType={"number-pad"}
                  maxLimit={2}
                  blurOnSubmit={false}
                  autoFocus={true}
                  style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                  onChangeText={(input) => this.onChangeText({month: input})}
                  onSubmitEditing={() => this.submit()} />

                <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                { /* Day input */ }
                <TextInput
                  ref={ref => this.dayField = ref}
                  defaultValue={this.state.day}
                  placeholder={"DD"}
                  placeholderTextColor={colors.slateGrey}
                  keyboardType={"number-pad"}
                  maxLimit={2}
                  blurOnSubmit={false}
                  style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center', borderRightWidth: 1, borderColor: colors.slateGrey}}
                  onChangeText={(input) => this.onChangeText({day: input})}
                  onSubmitEditing={() => this.submit()} />

                <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                { /* Year input */ }
                <TextInput
                  ref={ref => this.yearField = ref}
                  defaultValue={this.state.year}
                  placeholder={"YYYY"}
                  placeholderTextColor={colors.slateGrey}
                  keyboardType={"number-pad"}
                  maxLimit={4}
                  blurOnSubmit={false}
                  style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                  onChangeText={(input) => this.onChangeText({year: input})}
                  onSubmitEditing={() => this.submit()} />
              </View>

              { /* Submit button */ }
              <TouchableHighlight
                activeOpacity={0.65}
                underlayColor={'transparent'}
                onPress={() => this.submit()}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                  <EvilIcons name={"check"} size={38} color={colors.gradientGreen} />
                  <View style={{position: 'absolute', top: 10, bottom: 10, left: 0, width: 1, backgroundColor: colors.medGrey}} />
                </View>
              </TouchableHighlight>
            </View>
          </StickyView>
        </View>
      </Modal>
    )
  }
}

module.exports = RenewalDateInputModal
