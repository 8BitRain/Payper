import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {colors} from '../../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
        <Text>{"EMPTY STATE"}</Text>
      </View>
    )
  }
}

module.exports = BroadcastFeedEmptyState
