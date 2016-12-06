import React from 'react'
import { View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, Animated, Modal, TextInput, Keyboard} from 'react-native'
import { colors } from '../../../globalStyles'
import { StickyView } from '../../../components'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class Field extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      height: new Animated.Value(45),
      opacity: new Animated.Value(1)
    }

    this.state = {
      ...this.props,
      focused: false,
      hidden: false,
      touchable: true
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
        duration: 105
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  show() {
    this.setState({hidden: false, touchable: false})

    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 45,
        duration: 180
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 1,
        duration: 105
      })
    ]

    Animated.parallel(animations).start(() => this.setState({touchable: true}))
  }

  toggle() {
    this.setState({focused: !this.state.focused}, () => {
      this.props.toggleFieldFocus(this.state.title)
    })
  }

  render() {
    let {iconName, title, complete, hidden, focused, value, placeholder, textInputProps} = this.state
    let {height, opacity} = this.AV

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
            width: dims.width * 0.9, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderColor: colors.medGrey
          }}>

          { /* Icon and title */ }
          <EvilIcons name={iconName} size={32} color={colors.accent} />
          <Text style={{fontSize: 18, color: colors.deepBlue, paddingLeft: 10}}>
            {title}
          </Text>

          { /* Value or placeholder value */ }
          <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center'}}>
            <EvilIcons name={(focused) ? "minus" : "plus"} size={28} color={colors.medGrey} />
          </View>

          { /* Input modal */ }
          <Modal visible={this.state.focused} animationType={"slide"} transparent={true}>
            <TouchableWithoutFeedback onPress={() => this.toggle()}>
              <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}} />
            </TouchableWithoutFeedback>

            <StickyView>
              <View style={{alignItems: 'center', justifyContent: 'center', width: dims.width, backgroundColor: colors.lightGrey, padding: 10, paddingBottom: 0}}>
                <EvilIcons name={iconName} size={34} color={colors.deepBlue} />
              </View>

              <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
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

                <TextInput
                  defaultValue={value}
                  placeholderTextColor={colors.slateGrey}
                  blurOnSubmit={false}
                  autoFocus={true}
                  style={{flex: 0.65, height: 50, paddingLeft: 10, paddingRight: 10, textAlign: 'center'}}
                  {...textInputProps}
                  onChangeText={(input) => this.setState({value: input})}
                  onSubmitEditing={() => this.submit()} />

                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.toggle()}
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

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0.25,
      width: 0.25
    }
  }
})

module.exports = Field
