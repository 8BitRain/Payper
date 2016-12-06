import React from 'react'
import { View, TouchableHighlight, TouchableWithoutFeedback, Text, Dimensions, StyleSheet, Animated, Modal, TextInput, Keyboard} from 'react-native'
import { colors } from '../../../globalStyles'
import { StickyView } from '../../../components'
import { VibrancyView } from 'react-native-blur'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const dims = Dimensions.get('window')

class Tile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props,
      modalVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.focused === false && nextProps.focused === true)
      this.focus()
    else if (this.props.focused === true && nextProps.focused === false)
      this.unfocus()

    this.setState(nextProps)
  }

  focus() {
    this.setState({focused: true, modalVisible: true})
  }

  unfocus() {
    this.setState({focused: false, modalVisible: false})
  }

  submit() {
    // TODO: Validate input
    // TODO: Induce state
    // TODO: Notify success
    // TODO: Close modal
    this.unfocus()
    this.props.update(this.state.tileIndex, this.state.value)
  }

  render() {
    let {iconName, title, onPress, complete, backgroundColor, marginLeft, marginRight, height, width, opacity, leftAligned, focused, placeholder, value} = this.state

    return(
      <View>
        <TouchableHighlight
          activeOpacity={0.65}
          underlayColor={'transparent'}
          onPress={() => onPress()}>
          <Animated.View style={{width, height, justifyContent: 'center', overflow: 'hidden'}}>
            <Animated.View style={[styles.shadow, {opacity: opacity, marginLeft: (leftAligned) ? 12 : 6, marginRight: (leftAligned) ? 6 : 12, marginTop: 12, flex: 1.0, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center', borderRadius: 4}]}>
              { /* Icon and title */ }
              <EvilIcons name={iconName} size={44} color={colors.accent} />
              <Text style={{fontSize: 18, color: colors.deepBlue, textAlign: 'center'}}>
                {title}
              </Text>

              { /* Check mark (only if user has entered this info) */
                (complete)
                ? <EvilIcons name={"check"} size={30} color={colors.gradientGreen} style={{position: 'absolute', top: 8, right: 9}} />
                : null }
            </Animated.View>
          </Animated.View>
        </TouchableHighlight>

        { /* Input modal */ }
        <Modal visible={this.state.modalVisible} animationType={"slide"} transparent={true}>
          <View style={{flex: 1.0}}>
            { /* Background */ }
            <TouchableWithoutFeedback onPress={() => this.unfocus()}>
              <VibrancyView blurType={"dark"} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
            </TouchableWithoutFeedback>

            <StickyView>
              { /* Icon */ }
              <View style={{alignItems: 'center', justifyContent: 'center', width: dims.width, backgroundColor: colors.lightGrey, padding: 10, paddingBottom: 0}}>
                <EvilIcons name={iconName} size={34} color={colors.deepBlue} />
              </View>

              { /* Text input and cancel/submit buttons */ }
              <View style={{flexDirection: 'row', width: dims.width, backgroundColor: colors.lightGrey}}>
                <TouchableHighlight
                  activeOpacity={0.65}
                  underlayColor={'transparent'}
                  onPress={() => this.unfocus()}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                    <EvilIcons name={"close-o"} size={30} color={colors.carminePink} />
                    <View style={{position: 'absolute', top: 4, bottom: 4, right: 0, width: 1, backgroundColor: colors.medGrey}} />
                  </View>
                </TouchableHighlight>

                <TextInput
                  defaultValue={value}
                  placeholder={placeholder}
                  placeholderTextColor={colors.slateGrey}
                  blurOnSubmit={false}
                  autoFocus
                  style={{flex: 0.65, height: 50, paddingLeft: 15, paddingRight: 15}}
                  onChangeText={(input) => this.setState({value: input})}
                  onSubmitEditing={() => this.submit()} />

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
          </View>
        </Modal>
      </View>
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

module.exports = Tile
