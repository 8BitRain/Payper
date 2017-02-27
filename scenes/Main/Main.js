import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {
  Header,
  BroadcastsFeed,
  ExploreFeed,
  MeFeed
} from '../../components'
import { updateFCMToken} from '../../helpers/lambda'
import Button from 'react-native-button'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as dispatchers from './MainState'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  newBroadcastButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 20
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            console.log("FCM Token: " + token);
            let data = {
              token: this.props.token,
              FCMToken: token
            }
            updateFCMToken(data, (callback) =>{
              console.log("Callback: ", callback);
            });

            // store fcm token in your server
        });
  }
  componentWillMount() {
    this.props.currentUser.startListeningToFirebase((updates) => this.props.updateCurrentUser(updates))
  }

  render() {
    return (
      <View style={{flex: 1}}>

        { /* Header */ }
        <Header {...this.props} showSideMenuButton showTabBar />

        { /* Inner content */ }
        <View style={styles.container}>
          {this.props.title === "Broadcasts"  ? <BroadcastsFeed {...this.props} />  : null}
          {this.props.title === "Explore"     ? <ExploreFeed {...this.props} />     : null}
          {this.props.title === "Me"          ? <MeFeed {...this.props} />          : null}
        </View>

        { /* New broadcast button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={Actions.BroadcastOnboardingFlow}>
          <View style={styles.newBroadcastButton}>
            <EvilIcons name={"plus"} color={colors.accent} size={48} />
          </View>
        </TouchableHighlight>

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
    setCurrentUser: (input) => dispatch(dispatchers.setCurrentUser(input)),
    updateCurrentUser: (input) => dispatch(dispatchers.updateCurrentUser(input))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Main)
