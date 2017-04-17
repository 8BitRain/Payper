import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../../globalStyles'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.medGrey
  }
})

class MeFeedEmptyState extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={{width: dims.width * 0.8, marginBottom: 30, paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10, borderRadius: 5, backgroundColor: colors.lightGrey, borderWidth: 1, borderColor: colors.medGrey, alignItems: 'center'}}>
          <Text style={{color: colors.accent, fontSize: 18, fontWeight: '500', textAlign: 'center'}}>
            {"Nothing to see here, yet."}
          </Text>
          <Text style={{color: colors.deepBlue, fontSize: 16, textAlign: 'center'}}>
            {"This is where your broadcasts and subscriptions will appear."}
          </Text>
        </View>
      </View>
    )
  }
}

module.exports = MeFeedEmptyState
