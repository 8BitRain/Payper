import React from 'react'
import {View, Image, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class Splash extends React.Component {
  componentDidMount() {
    setTimeout(Actions.Interests, 600)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={{width: dims.width * (117/635), height: (dims.width * (117/635) * (568/377))}} />
      </View>
    )
  }
}

module.exports = Splash
