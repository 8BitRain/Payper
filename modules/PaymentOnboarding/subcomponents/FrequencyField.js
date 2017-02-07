import React from 'react'
import { View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, Animated, Modal, TextInput, Keyboard, Alert } from 'react-native'
import { colors } from '../../../globalStyles'
import { StickyView } from '../../../components'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import DeviceInfo from 'react-native-device-info'
const dims = Dimensions.get('window')

class FrequencyField extends React.Component {
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
      input: ""
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
        toValue: DeviceInfo.getSystemName() == "Android" ? 30 : 20,
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
    let {value, validateInput, invalidityAlert, setValue} = this.props
    let {input} = this.state

    // Validate input
    let inputIsValid = validateInput(input)
    if (!inputIsValid) {
      let title = "Wait!"
      let msg = invalidityAlert || "Input is invalid."
      Alert.alert(title, msg, [{text: 'OK', onPress: () => this.inputField.focus()}])
      return
    }

    // Show value in this component/set value in parent component
    let shouldShowValue = value.length < 1 && input.length >= 1
    setValue(input, () => (shouldShowValue) ? this.showValue() : null)
    this.toggle(/*(shouldContinueFlow)*/true)
  }

  render() {
    let {
      iconName, title, complete, value, placeholder,
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
              {value}
            </Text>
          </Animated.View>

          { /* Input modal */ }
          <Modal visible={this.state.focused} animationType={"slide"} transparent={true}>
            { /* Touching background dismisses field */ }
            <TouchableWithoutFeedback onPress={() => this.toggle(/*(shouldContinueFlow)*/false)}>
              <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}} />
            </TouchableWithoutFeedback>

            <Animated.View style={{backgroundColor: colors.snowWhite, marginTop: height._value + 60, paddingBottom: height._value + 132, width: dims.width, height: dims.height, paddingTop: 20, justifyContent: 'center', alignItems: 'center'}}>

              { /* Touching background dismisses field */ }
              <TouchableWithoutFeedback onPress={() => this.toggle(/*(shouldContinueFlow)*/false)}>
                <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}} />
              </TouchableWithoutFeedback>

              { /* 'Monthly' button */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => { this.setState({input: "Monthly"}, () => this.submit()) }}>
                <View
                  style={{
                    width: dims.width * 0.85, height: 50, marginTop: 6, backgroundColor: colors.accent, borderRadius: 4, justifyContent: 'center', alignItems: 'center',
                    shadowColor: colors.medGrey, shadowOpacity: 0.75, shadowRadius: 2, shadowOffset: { height: 0, width: 0 }
                  }}>
                  <Text style={{color: colors.snowWhite, fontSize: 18, textAlign: 'center'}}>
                    {"Monthly"}
                  </Text>
                </View>
              </TouchableHighlight>

              { /* 'Weekly' button */ }
              <TouchableHighlight
                activeOpacity={0.8}
                underlayColor={'transparent'}
                onPress={() => { this.setState({input: "Weekly"}, () => this.submit()) }}>
                <View
                  style={{
                    width: dims.width * 0.85, height: 50, marginTop: 6, backgroundColor: colors.gradientGreen, borderRadius: 4, justifyContent: 'center', alignItems: 'center',
                    shadowColor: colors.medGrey, shadowOpacity: 0.75, shadowRadius: 2, shadowOffset: { height: 0, width: 0 }
                  }}>
                  <Text style={{color: colors.snowWhite, fontSize: 18, textAlign: 'center'}}>
                    {"Weekly"}
                  </Text>
                </View>
              </TouchableHighlight>
            </Animated.View>
          </Modal>
        </Animated.View>
      </TouchableHighlight>
    )
  }
}

module.exports = FrequencyField
