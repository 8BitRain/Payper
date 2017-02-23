import React from 'react'
import {View, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'brown',
    flex: 1,
    backgroundColor: 'transparent'
  }
})

class Title extends React.Component {
  render() {
    return(
      <View style={styles.container} />
    )
  }
}

module.exports = Title
