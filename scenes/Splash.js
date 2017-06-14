
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
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    FBLoginManager.logOut()

    // codePush.sync({
    //   deploymentKey: config[config.env].codePushKey,
    //   installMode: codePush.InstallMode.IMMEDIATE
    // }, (status) => {
    //   console.log("--> codePush sync status:", status)
    //
    //   // Statuses:
    //   // -1   UNKNOWN_ERROR
    //   //  0   CHECKING_FOR_UPDATE
    //   //  1   AWAITING_USER_ACTION
    //   //  2   DOWNLOADING_PACKAGE
    //   //  3   INSTALLING_UPDATE
    //   //  4   UP_TO_DATE
    //   //  5   UPDATE_IGNORED
    //   //  6   UPDATE_INSTALLED
    //   //  7   SYNC_IN_PROGRESS
    //   if (status === -1 || status === 4 || status === 5 || status === 6) {
    //     this.onConnect()
    //   }
    // })

    this.onConnect()
  }

  onConnect() {
    getFromAsyncStorage('hasAccess', (val) => {
      // NOTE: Beta lander code
      // User does not have access. Go to InviteOnlyLander
      // if ("yes" !== val) {
      //   Actions.InviteOnlyLander()
      //   return
      // }
      getFromAsyncStorage('user', (cachedUser) => {
        // No user is cached. Go to Lander
        if (!cachedUser) {
          Actions.Lander({type: 'replace'})
          return
        }

        login({
          mode: "cache",
          cachedUser: JSON.parse(cachedUser),
          onSuccess: (response) => {
            this.props.currentUser.initialize(response)
            Actions.Main({type: 'replace'})
          },
          onFailure: (err) => {
            console.log("Cache login failed. Error:", err)
            Actions.Lander({type: 'replace'})
          }
        })
      })
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
