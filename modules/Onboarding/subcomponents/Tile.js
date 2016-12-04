import React from 'react'
import { View, TouchableHighlight, Text, Dimensions, StyleSheet, Animated } from 'react-native'
import { colors } from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class Tile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {iconName, title, onPress, complete, backgroundColor, marginLeft, marginRight, height, width, opacity} = this.props

    return(
      <TouchableHighlight
        activeOpacity={0.65}
        underlayColor={'transparent'}
        onPress={() => onPress()}>
        <Animated.View style={{width, height, justifyContent: 'center', overflow: 'hidden'}}>
          <Animated.View style={[styles.shadow, {opacity: opacity, marginLeft, marginRight, marginTop: 8, flex: 1.0, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center', borderRadius: 4}]}>
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
