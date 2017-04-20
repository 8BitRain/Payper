import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {Header} from '../../components'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

class DisputesModal extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <Header showTitle showBackButton title="Disputes" />
      </View>
    )
  }
}

module.exports = DisputesModal
