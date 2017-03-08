import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import {colors} from '../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class ExploreFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>{"ExploreFeed"}</Text>
      </View>
    )
  }
}

module.exports = ExploreFeed
