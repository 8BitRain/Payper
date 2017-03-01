// TODO: Add a loading state with animated color interpolation and moving dots
import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    width: dims.width * 0.8,
    backgroundColor: colors.gradientGreen,
    height: 45,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  text: {
    fontSize: 16,
    color: colors.snowWhite
  }
})

class ContinueButton extends React.Component {
  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => {
          if (this.props.onPress) this.props.onPress()
          else throw "ContinueButton expected 'onPress' prop."
        }}>
        <View style={[
          styles.container,
          this.props.containerStyles || {}
        ]}>
          <Text style={styles.text}>
            {this.props.customText || "Continue"}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = ContinueButton
