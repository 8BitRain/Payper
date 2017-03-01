import React from 'react'
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  infoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 4,
    width: dims.width * 0.85
  },
  infoText: {
    marginTop: 6,
    fontSize: 17,
    color: colors.deepBlue,
    textAlign: 'center',
    flexWrap: 'wrap'
  }
})

class InfoBox extends React.Component {
  render() {
    return(
      <View style={styles.infoWrap}>
        <Entypo name={"info-with-circle"} color={colors.accent} size={22} />
        <Text style={styles.infoText}>
          {this.props.text}
        </Text>
      </View>
    )
  }
}

module.exports = InfoBox
