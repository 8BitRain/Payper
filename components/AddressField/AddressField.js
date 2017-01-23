import React from 'react'
import {
  View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions,
  StyleSheet, Animated, Modal, TextInput, Keyboard, Alert, ScrollView
} from 'react-native'
import {colors} from '../../globalStyles'
import {StickyView} from '../../components'
import {VibrancyView} from 'react-native-blur'
import {AddressTextInput} from './subcomponents'
import {ListOfStates, ListOfStateAbbreviations} from '../../helpers'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class AddressField extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      opacity: new Animated.Value(1),
      height: new Animated.Value(70),
      valueOpacity: new Animated.Value(0),
      valueHeight: new Animated.Value(0),
      valuePaddingBottom: new Animated.Value(0),
      textInputsOpacity: new Animated.Value(0)
    }

    this.state = {
      ...this.props,
      focused: false,
      hidden: false,
      touchable: true,
      street: props.streetValue || "",
      city: props.cityValue || "",
      state: props.stateValue || "",
      zip: props.zipValue || ""
    }

    this.inputRefs = {}
    this.induceInputRef = this.induceInputRef.bind(this)
  }

  componentWillMount() {
    this.props.induceFieldRef(this)
  }

  induceInputRef(name, ref) {
    this.inputRefs[name] = ref
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
      this.toggleInputs()
      this.props.toggleFieldFocus(this.state.title, shouldContinueFlow)
    })
  }

  toggleInputs(shouldShow) {
    let {focused} = this.state
    let {textInputsOpacity} = this.AV

    let animations = [
      Animated.timing(textInputsOpacity, {
        toValue: (focused) ? 1 : 0,
        duration: 200
      })
    ]

    Animated.parallel(animations).start()
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

  validateInput() {
    let {street, city, state, zip} = this.state

    let formattedState
    if (state.length === 2)
      formattedState = state.toUpperCase()
    else if (state.length >= 3)
      formattedState = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()
    else
      formattedState = ""

    let streetIsValid = true
    let cityIsValid = true
    let stateIsValid = ListOfStates[formattedState] || ListOfStateAbbreviations[formattedState]
    let zipIsValid = zip.length === 5

    let addressIsValid = streetIsValid && cityIsValid && stateIsValid && zipIsValid
    let fieldToFocus = null
    let invalidityAlert = null

    if (!addressIsValid) {
      if (!streetIsValid) {
        invalidityAlert = "Please enter a valid street address."
        fieldToFocus = this.inputRefs["Street"]
      }

      else if (!cityIsValid) {
        invalidityAlert = "Please enter a valid city."
        fieldToFocus = this.inputRefs["City"]
      }

      else if (!stateIsValid) {
        invalidityAlert = "Please enter a valid state."
        fieldToFocus = this.inputRefs["State"]
      }

      else if (!zipIsValid) {
        invalidityAlert = "Please enter a valid ZIP code."
        fieldToFocus = this.inputRefs["ZIP"]
      }
    }

    return {addressIsValid, fieldToFocus, invalidityAlert}
  }

  submit() {
    let {setValues} = this.props
    let {street, city, state, zip} = this.state

    // Validate input
    let validityReport = this.validateInput()
    let {addressIsValid, fieldToFocus, invalidityAlert} = validityReport

    // Input is invalid
    if (!addressIsValid) {
      let title = "Wait!"
      let msg = invalidityAlert || "Input is invalid."
      Alert.alert(title, msg, [{text: 'OK', onPress: () => (fieldToFocus) ? fieldToFocus.focus() : null}])
      return
    }

    // State has already been validated at this point. Make sure it's
    // properly formatted before passing to parent
    if (state.length === 2)
      state = state.toUpperCase()
    else
     state = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()

    // Show value in this component/set value in parent component
    setValues({
      street: street,
      city: city,
      state: state,
      zip: zip
    }, () => this.showValue())
    this.toggle(/*(shouldContinueFlow)*/true)
  }

  render() {
    let {
      iconName, iconType, iconSize, title, complete, value, placeholder,
      textInputProps
    } = this.props

    let {
      focused, hidden, touchable, input,
      street, city, state, zip
    } = this.state

    let {
      opacity, height,
      valueOpacity, valueHeight, valuePaddingBottom,
      textInputsOpacity
    } = this.AV

    return(
      <View>
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
                { /* (street.length >= 13)
                  ? street.substring(0, 13) + "..."
                  : street + "..." */ }
                {street}
              </Text>
            </Animated.View>
          </Animated.View>
        </TouchableHighlight>

        { /* Inputs */
          (!focused)
            ? null
            : <Animated.View style={{opacity: textInputsOpacity}}>
                <ScrollView>

                  { /* Street */ }
                  <AddressTextInput
                    label={"Street"}
                    containerStyles={{marginTop: 20}}
                    textInputProps={{
                      autoCapitalize: "words",
                      autoCorrect: false,
                      autoFocus: true,
                      returnKeyType: "next",
                      defaultValue: street,
                      placeholder: "ex. 1 North St",
                      onSubmitEditing: () => this.inputRefs.City.focus(),
                      onChangeText: (text) => this.setState({street: text})
                    }}
                    induceInputRef={(name, ref) => this.induceInputRef(name, ref)} />

                  { /* City */ }
                  <AddressTextInput
                    label={"City"}
                    textInputProps={{
                      autoCapitalize: "words",
                      autoCorrect: false,
                      returnKeyType: "next",
                      defaultValue: city,
                      placeholder: "ex. Sacramento",
                      onSubmitEditing: () => this.inputRefs.State.focus(),
                      onChangeText: (text) => this.setState({city: text})
                    }}
                    induceInputRef={(name, ref) => this.induceInputRef(name, ref)} />

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    { /* State */ }
                    <AddressTextInput
                      label={"State"}
                      textInputProps={{
                        autoCorrect: false,
                        blurOnSubmit: true,
                        defaultValue: state,
                        returnKeyType: "next",
                        autoCapitalize: "words",
                        placeholder: "ex. CA or California",
                        onSubmitEditing: () => this.inputRefs.ZIP.focus(),
                        onChangeText: (text) => this.setState({state: text})
                      }}
                      containerStyles={{
                        width: dims.width * 0.43
                      }}
                      induceInputRef={(name, ref) => this.induceInputRef(name, ref)} />

                    { /* ZIP Code */ }
                    <AddressTextInput
                      label={"ZIP"}
                      textInputProps={{
                        autoCorrect: false,
                        maxLength: 5,
                        keyboardType: "number-pad",
                        returnKeyType: "done",
                        defaultValue: zip,
                        placeholder: "ex. 12345",
                        onSubmitEditing: () => this.submit(),
                        onChangeText: (text) => {
                          this.setState({zip: text})
                          if (text.length === 5) this.inputRefs.ZIP.blur()
                        }
                      }}
                      containerStyles={{
                        width: dims.width * 0.43
                      }}
                      induceInputRef={(name, ref) => this.induceInputRef(name, ref)} />
                  </View>

                  <TouchableHighlight underlayColor={'transparent'} onPress={() => this.submit()}>
                    <Text style={{flex: 1.0, textAlign: 'center', fontSize: 16, marginTop: 10, color: colors.snowWhite, backgroundColor: colors.lightGrey, padding: 14, borderRadius: 4, overflow: 'hidden'}}>
                      <EvilIcons name={"check"} color={colors.gradientGreen} size={50} />
                    </Text>
                  </TouchableHighlight>

                  <View style={{flex: 1.0, height: 250}} />

                </ScrollView>
              </Animated.View> }

      </View>
    )
  }
}

module.exports = AddressField
