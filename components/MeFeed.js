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

class MeFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>{"MeFeed"}</Text>
      </View>
    )
  }
}

module.exports = MeFeed
