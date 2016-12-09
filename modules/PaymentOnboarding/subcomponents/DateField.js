import React from 'react'
import moment from 'moment'
import { View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, Animated, Modal, TextInput, Keyboard, Alert } from 'react-native'
import { colors } from '../../../globalStyles'
import { StickyView } from '../../../components'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class DateField extends React.Component {
  constructor(props) {
    super(props)

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

  toggle() {
    this.setState({focused: !this.state.focused}, () => {
      this.props.toggleFieldFocus(this.state.title)
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

  submit() {
    let {value, validateInput, invalidityAlert, setValues} = this.props
    let {dayInput, monthInput, yearInput} = this.state
    let input = dayInput + "-" + monthInput + "-" + yearInput

    // Validate input
    let inputIsValid = validateInput(input)
    if (!inputIsValid) {
      let title = "Wait!"
      let msg = invalidityAlert || "Input is invalid."
      Alert.alert(title, msg, [{text: 'OK', onPress: () => this.inputField.focus()}])
      return
    }

    setValues(input, () => this.showValue())
    this.toggle()
  }

  autoFillWithTodaysDate() {
    let {setValues} = this.props
    let now = new Date()
    let day = now.getDate()
    let month = now.getMonth() + 1
    let year = now.getFullYear()
    let combined = day + "-" + month + "-" + year
    this.setState({dayInput: day, monthInput: month, yearInput: year})
    setValues(combined, () => this.showValue())
  }

  render() {
    let {
      iconName, title, complete, dayValue, monthValue, yearValue, placeholder,
      textInputProps
    } = this.props

    let {
      focused, hidden, touchable, input
    } = this.state

    let {
      opacity, height,
      valueOpacity, valueHeight, valuePaddingBottom
    } = this.AV

    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this.toggle()}>
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
              <EvilIcons name={(focused) ? "minus" : "plus"} size={28} color={colors.medGrey} />
            </View>
          </View>

          { /* Value */ }
          <Animated.View style={{paddingBottom: valuePaddingBottom, height: valueHeight, opacity: valueOpacity, flexDirection: 'row', alignItems: 'center'}}>
            <EvilIcons name={iconName} size={32} color={'transparent'} />

            <Text style={{fontSize: 18, color: colors.gradientGreen, paddingLeft: 10}}>
              {moment(dayValue + "-" + monthValue + "-" + yearValue).calendar()}
            </Text>
          </Animated.View>

          { /* Input modal */ }
          <Modal visible={this.state.focused} animationType={"slide"} transparent={true}>
            { /* Touching background dismisses field */ }
            <TouchableWithoutFeedback onPress={() => this.toggle()}>
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
                  <TouchableHighlight
                    activeOpacity={0.65}
                    underlayColor={'transparent'}
                    onPress={() => this.autoFillWithTodaysDate()}>
                    <View style={{flex: 1.0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 4}}>
                      <Text style={{fontSize: 16, color: colors.accent}}>
                        {"Today"}
                      </Text>
                      <EvilIcons name={"chevron-right"} color={colors.accent} size={26} style={{paddingTop: 3}} />
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
                { /* Cancel button */ }
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.toggle()}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                    <EvilIcons name={"close-o"} size={30} color={colors.carminePink} />
                    <View style={{position: 'absolute', top: 4, bottom: 4, right: 0, width: 1, backgroundColor: colors.medGrey}} />
                  </View>
                </TouchableHighlight>

                <View style={{flexDirection: 'row', alignItems: 'center', flex: 0.65, height: 50}}>
                  { /* Day input */ }
                  <TextInput
                    ref={ref => this.dayField = ref}
                    defaultValue={dayValue}
                    placeholder={"DD"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    blurOnSubmit={false}
                    autoFocus={true}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center', borderRightWidth: 1, borderColor: colors.slateGrey}}
                    onChangeText={(input) => this.setState({dayInput: input})}
                    onSubmitEditing={() => this.submit()} />

                  <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                  { /* Month input */ }
                  <TextInput
                    ref={ref => this.monthField = ref}
                    defaultValue={monthValue}
                    placeholder={"MM"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    blurOnSubmit={false}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                    onChangeText={(input) => this.setState({dayInput: input})}
                    onSubmitEditing={() => this.submit()} />

                  <View style={{height: 32, width: 1, backgroundColor: colors.medGrey}} />

                  { /* Year input */ }
                  <TextInput
                    ref={ref => this.yearField = ref}
                    defaultValue={yearValue}
                    placeholder={"YYYY"}
                    placeholderTextColor={colors.slateGrey}
                    keyboardType={"number-pad"}
                    blurOnSubmit={false}
                    style={{flex: 0.3333, height: 50, paddingLeft: 4, paddingRight: 4, textAlign: 'center'}}
                    onChangeText={(input) => this.setState({dayInput: input})}
                    onSubmitEditing={() => this.submit()} />
                </View>

                { /* Submit button */ }
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.submit()}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                    <EvilIcons name={"check"} size={30} color={colors.gradientGreen} />
                    <View style={{position: 'absolute', top: 4, bottom: 4, left: 0, width: 1, backgroundColor: colors.medGrey}} />
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
