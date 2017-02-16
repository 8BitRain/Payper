import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    padding: 20
  }
})

class BroadcastPreview extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>{"!"}</Text>
      </View>
    )
  }
}

module.exports = BroadcastPreview
