import React from 'react'
import {View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, Animated, Modal, TextInput, Keyboard, Alert} from 'react-native'
import {colors} from '../../globalStyles'
import {StickyView} from '../../components'
import {VibrancyView} from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class TextField extends React.Component {
  constructor(props) {
    super(props)

    let value = this.props.value

    this.AV = {
      opacity: new Animated.Value(1),
      height: new Animated.Value(70),
      valueOpacity: new Animated.Value((value) ? 1 : 0),
      valueHeight: new Animated.Value((value) ? 20 : 0),
      valuePaddingBottom: new Animated.Value((value) ? 16 : 0)
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
      iconName, iconType, iconSize, title, complete, value, placeholder,
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

            <View style={{width: 32, justifyContent: 'center', alignItems: 'center'}}>
              {(iconType === "ionicon")
                ? <Ionicons name={iconName} size={iconSize || 32} color={colors.accent} />
                : <EvilIcons name={iconName} size={iconSize || 32} color={colors.accent} /> }
            </View>

            <Text style={{fontSize: 18, color: colors.deepBlue, paddingLeft: 10}}>
              {title}
            </Text>

            <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center'}}>
              <EvilIcons name={(focused) ? "minus" : "plus"} size={28} color={colors.slateGrey} />
            </View>
          </View>

          { /* Value */ }
          <Animated.View style={{paddingBottom: valuePaddingBottom, height: valueHeight, opacity: valueOpacity, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 32}} />

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

            { /* Input sticks to top of keyboard */ }
            <StickyView duration={0}>
              <View style={{alignItems: 'center', justifyContent: 'center', width: dims.width, backgroundColor: colors.lightGrey, padding: 10, paddingBottom: 0}}>
                {(iconType === "ionicon")
                  ? <Ionicons name={iconName} size={iconSize || 34} color={colors.deepBlue} />
                  : <EvilIcons name={iconName} size={iconSize || 34} color={colors.deepBlue} /> }
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

                { /* Input field */ }
                <TextInput
                  ref={ref => this.inputField = ref}
                  defaultValue={textInputProps.defaultValue || value}
                  placeholderTextColor={colors.slateGrey}
                  blurOnSubmit={false}
                  autoFocus={true}
                  style={{flex: 0.65, height: 50, paddingLeft: 10, paddingRight: 10, textAlign: 'center'}}
                  {...textInputProps}
                  onChangeText={(input) => this.setState({input: input})}
                  onSubmitEditing={() => this.submit()} />

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

module.exports = TextField
