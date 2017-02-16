import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {colors} from '../globalStyles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    paddingLeft: 10,
    backgroundColor: '#ededed'
  },
  text: {
    color: colors.deepBlue,
    fontSize: 17
  }
})

class BroadcastFeedSectionHeader extends React.Component {
  render() {
    if (!this.props.sectionID) return <View />

    return(
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.sectionID}
        </Text>
      </View>
    )
  }
}

module.exports = BroadcastFeedSectionHeader
