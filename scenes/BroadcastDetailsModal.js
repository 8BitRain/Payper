import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red'
  }
})

class BroadcastDetailsModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{'Broadcast Details'}</Text>
        <Button onPress={Actions.pop}>{'Back'}</Button>
      </View>
    )
  }
}

module.exports = BroadcastDetailsModal
