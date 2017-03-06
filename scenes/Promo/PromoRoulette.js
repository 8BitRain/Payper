import React from 'react'
import {View, StyleSheet} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class PromoRoulette extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={() => Actions.PromoInvite({
          subscription: {
            name: 'Netflix',
            logo: '../../assets/images/logos/netflix.png'
          }
        })}>
          {"Continue"}
        </Button>
        <Button onPress={Actions.pop}>
          {"Back"}
        </Button>
      </View>
    )
  }
}

module.exports = PromoRoulette
