import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: colors.medGrey,
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
    fontSize: 18,
    color: colors.deepBlue
  }
})

class JoinButton extends React.Component {
  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => {
          if (this.props.onPress) this.props.onPress()
          else throw "JoinButton expected 'onPress' prop."
        }}>
        <View style={styles.container}>
          <Text style={styles.text}>
            {this.props.customText || "Join"}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = JoinButton
