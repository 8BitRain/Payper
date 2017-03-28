
// TODO: HANDLE CONNECTIVITY CHECK
import React from 'react'
import config from '../config'
import codePush from 'react-native-code-push'
import {View, Text, Image, NetInfo, TouchableHighlight, Animated, Easing, Dimensions, StatusBar, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {FBLoginManager} from 'NativeModules'
import {colors} from '../globalStyles'
import {login} from '../helpers/auth'
import {getFromAsyncStorage} from '../helpers/asyncStorage'
import {connect} from 'react-redux'
import * as dispatchers from './Main/MainState'

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
  componentWillMount() {

    // Sync with codepush
    codePush.sync({
      deploymentKey: config[config.env].codePushKey,
      updateDialog: false,
      installMode: codePush.InstallMode.IMMEDIATE
    })

    // Log out of Facebook auth so button doesn't say 'log out'
    FBLoginManager.logOut()

    // Continue in app flow
    getFromAsyncStorage('userData', (userData) => {
      if (!userData) Actions.Lander()
      else Actions.PromoWaitingRoom({userData: JSON.parse(userData)})
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={{width: dims.width * (117/635), height: (dims.width * (117/635) * (568/377))}} />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Splash)
