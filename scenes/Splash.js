
// TODO: HANDLE CONNECTIVITY CHECK
import React from 'react'
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
    this.onConnect()
  }

  onConnect() {
    getFromAsyncStorage('hasAccess', (val) => {
      // User does not have access. Go to InviteOnlyLander
      if ("yes" !== val) {
        Actions.InviteOnlyLander()
        return
      }

      getFromAsyncStorage('user', (cachedUser) => {
        // No user is cached. Go to Lander
        if (!cachedUser) {
          Actions.Lander()
          return
        }

        login({
          mode: "cache",
          cachedUser: JSON.parse(cachedUser),
          onSuccess: (response) => {
            this.props.currentUser.initialize(response)
            Actions.Main()
          },
          onFailure: (err) => {
            console.log("Cache login failed. Error:", err)
            Actions.Lander()
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
