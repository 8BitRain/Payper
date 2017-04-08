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

class BroadcastFeedEmptyState extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={{width: dims.width * 0.75, padding: 14, marginBottom: 30, borderRadius: 5, backgroundColor: colors.lightGrey, borderWidth: 1, borderColor: colors.medGrey, alignItems: 'center'}}>
          <Text style={{color: colors.accent, fontSize: 18, fontWeight: '500'}}>
            {"Nothing to see here... yet"}
          </Text>
          <Text style={{color: colors.deepBlue, fontSize: 16}}>
            {"This is where broadcasts will appear."}
          </Text>
        </View>
      </View>
    )
  }
}

module.exports = BroadcastFeedEmptyState
