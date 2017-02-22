import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {colors} from '../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderColor: colors.medGrey,
    borderBottomWidth: 1
  }
})

class BroadcastFeedEmptyState extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>{"The empty state."}</Text>
      </View>
    )
  }
}

module.exports = BroadcastFeedEmptyState
