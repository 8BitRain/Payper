import React from 'react'
import moment from 'moment'
import {
  View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions,
  StyleSheet, Animated, Modal, TextInput, Keyboard, Alert
} from 'react-native'
import { colors } from '../../globalStyles'
import { StickyView } from '../../components'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class DateField extends React.Component {
  constructor(props) {
    super(props)

    this.months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    this.numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    this.AV = {
      opacity: new Animated.Value(1),
      height: new Animated.Value(70),
      valueOpacity: new Animated.Value(0),
      valueHeight: new Animated.Value(0),
      valuePaddingBottom: new Animated.Value(0)
    }

    this.state = {
      ...this.props,
      focused: false,
      hidden: false,
      touchable: true,
      dayInput: "",
      monthInput: "",
      yearInput: ""
    }

    this.validateInput = this.validateInput.bind(this)
  }

  componentWillMount() {
    this.props.induceFieldRef(this)
  }

  hide() {
    this.setState({hidden: true, touchable: false})

    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 0,
        duration: 180
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 0,
        duration: 150
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  show() {
    this.setState({hidden: false, touchable: false})

    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 70,
        duration: 180
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 1,
        duration: 150
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  toggle(shouldContinueFlow) {
    this.setState({focused: !this.state.focused}, () => {
      this.props.toggleFieldFocus(this.state.title, shouldContinueFlow)
    })
  }

  showValue() {
    let animations = [
      Animated.timing(this.AV.valueOpacity, {
        toValue: 1,
        duration: 110
      }),
      Animated.timing(this.AV.valueHeight, {
        toValue: 20,
        duration: 140
      }),
      Animated.timing(this.AV.valuePaddingBottom, {
        toValue: 16,
        duration: 140
      })
    ]

    Animated.parallel(animations).start()
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

    // Valid start relative to today's date
    let dateFormat = 'MM-DD-YYYY'
    let nowMoment = moment()
    let inputMoment = moment(input, dateFormat)
    let dateIsInPast = inputMoment.isBefore(nowMoment, 'day')

    // Validate day
    let dayExceedsMaximum = dayFloat > this.numDaysInMonth[monthIndex]
    let dayIsZero = dayFloat < 1
    let dayIsValid = !dayExceedsMaximum && !dayIsZero

    // Validate month
    let monthExceedsMaximum = monthFloat > 12
    let monthIsZero = monthFloat < 1
    let monthIsValid = !monthExceedsMaximum && !monthIsZero

    // Compile validations
    let isValid = dayIsValid && monthIsValid && dateIsInPast

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
      else if (!dateIsInPast) {
        errorMessage = "Date must be in the past."
        fieldToFocus = "yearField"
      }
    }

    return {inputIsValid: isValid, errorMessage: errorMessage, fieldToFocus: fieldToFocus}
  }

  submit() {
    let {value, invalidityAlert, setValues} = this.props
    let {dayInput, monthInput, yearInput} = this.state
    let {validateInput} = this

    let input = monthInput + "-" + dayInput + "-" + yearInput

    // Validate input
    let {inputIsValid, errorMessage, fieldToFocus} = validateInput(input)
    if (!inputIsValid) {
      let title = "Wait!"
      let msg = errorMessage || "Input is invalid."
      Alert.alert(title, msg, [{text: 'OK', onPress: () => (this[fieldToFocus]) ? this[fieldToFocus].focus() : null}])
      return
    }

    setValues(input, () => this.showValue())
    this.toggle(/*(shouldContinueFlow)*/true)
  }

  autoFillWithTodaysDate() {
    let {setValues} = this.props
    let now = new Date()
    let day = now.getDate()
    let month = now.getMonth() + 1
    let year = now.getFullYear()
    let combined = day + "-" + month + "-" + year
    this.setState({dayInput: day, monthInput: month, yearInput: year}, () => this.submit())
  }

  onChangeText(input) {
    let key = Object.keys(input)[0]
    let val = input[key]

    // Should input focus shift from month to day?
    let monthIsTwoDigits = key === "monthInput" && val.length === 2
    let monthCannotBeMoreThanOneDigit = key === "monthInput" && val.length === 1 && val >= 3
    let shouldShiftFromMonthToDay = monthIsTwoDigits || monthCannotBeMoreThanOneDigit

    // Should input focus shift from day to year?
    let dayIsTwoDigits = key === "dayInput" && val.length === 2
    let dayCannotBeMoreThanOneDigit = key === "dayInput" && val.length === 1 && val >= 4
    let shouldShiftFromDayToYear = dayIsTwoDigits || dayCannotBeMoreThanOneDigit

    if (shouldShiftFromMonthToDay) this.dayField.focus()
    else if (shouldShiftFromDayToYear) this.yearField.focus()

    this.setState(input)
  }

  render() {
    let {
      iconName, title, complete, dayValue, monthValue, yearValue, placeholder,
      textInputProps, showTodayButton
    } = this.props

    let {
      focused, hidden, touchable, input
    } = this.state

    let {
      opacity, height,
      valueOpacity, valueHeight, valuePaddingBottom
    } = this.AV

    let values = monthValue.toString() + "-" + dayValue.toString() + "-" + yearValue.toString()
    let calendarizedValue = moment(values, "MM-DD-YYYY").format('MMM Do[,] YYYY')

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.toggle(/*(shouldContinueFlow)*/false)}>
        <Animated.View
          style={{
            height: height,
            opacity: opacity,
            borderBottomWidth: (hidden) ? 0 : 1,
            width: dims.width * 0.9, borderColor: colors.medGrey
          }}>

          { /* Icon, title, and plus/minus */ }
          <View style={{flex: 1.0, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <EvilIcons name={iconName} size={32} color={colors.accent} />

            <Text style={{fontSize: 18, color: colors.deepBlue, paddingLeft: 10}}>
              {title}
            </Text>

            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center'}}>
              <EvilIcons name={(focused) ? "minus" : "plus"} size={28} color={colors.slateGrey} />
            </View>
          </View>

          { /* Value */ }
          <Animated.View style={{paddingBottom: valuePaddingBottom, height: valueHeight, opacity: valueOpacity, flexDirection: 'row', alignItems: 'center'}}>
            <EvilIcons name={iconName} size={32} color={'transparent'} />

            <Text style={{fontSize: 18, color: colors.gradientGreen, paddingLeft: 10}}>
              {calendarizedValue}
            </Text>
          </Animated.View>

          { /* Input modal */ }
          <Modal visible={this.state.focused} animationType={"slide"} transparent={true}>
            { /* Touching background dismisses field */ }
            <TouchableWithoutFeedback onPress={() => this.toggle(/*(shouldContinueFlow)*/false)}>
              <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}} />
            </TouchableWithoutFeedback>

            { /* Input sticks to top of keyboard */ }
            <StickyView duration={0}>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: dims.width, backgroundColor: colors.lightGrey, padding: 10, paddingBottom: 0}}>
                <View style={{flex: 0.3333}} />
                <View style={{flex: 0.3333, justifyContent: 'center', alignItems: 'center'}}>
                  <EvilIcons name={iconName} size={34} color={colors.deepBlue} />
                </View>
                <View style={{flex: 0.3333}}>
                  { /* 'Today' autofill button */
                    (!showTodayButton)
                      ? null
                      : <TouchableHighlight
                          activeOpacity={0.65}
                          underlayColor={'transparent'}
                          onPress={() => this.autoFillWithTodaysDate()}>
                          <View style={{flex: 1.0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 16, color: colors.accent, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, borderRadius: 4, backgroundColor: colors.snowWhite, overflow: 'hidden'}}>
                              {"Today"}
                            </Text>
                          </View>
                        </TouchableHighlight> }
                </View>
              </View>

              <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
                { /* Cancel button */ }
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.toggle(/*(shouldContinueFlow)*/false)}
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
                    defaultValue={monthValue}
                    placeholder={"MM"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    maxLimit={2}
                    blurOnSubmit={false}
                    autoFocus={true}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                    onChangeText={(input) => this.onChangeText({monthInput: input})}
                    onSubmitEditing={() => this.submit()} />

                  <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                  { /* Day input */ }
                  <TextInput
                    ref={ref => this.dayField = ref}
                    defaultValue={dayValue}
                    placeholder={"DD"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    maxLimit={2}
                    blurOnSubmit={false}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center', borderRightWidth: 1, borderColor: colors.slateGrey}}
                    onChangeText={(input) => this.onChangeText({dayInput: input})}
                    onSubmitEditing={() => this.submit()} />

                  <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                  { /* Year input */ }
                  <TextInput
                    ref={ref => this.yearField = ref}
                    defaultValue={yearValue}
                    placeholder={"YYYY"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    maxLimit={4}
                    blurOnSubmit={false}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                    onChangeText={(input) => this.onChangeText({yearInput: input})}
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
          </Modal>
        </Animated.View>
      </TouchableHighlight>
    )
  }
}

module.exports = DateField
