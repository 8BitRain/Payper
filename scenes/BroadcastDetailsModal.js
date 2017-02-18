import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {Header} from '../components'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

class BroadcastDetailsModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title={this.props.title} showBackButton showTitle />
      </View>
    )
  }
}

module.exports = BroadcastDetailsModal
