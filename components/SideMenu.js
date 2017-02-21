import React from 'react'
import {View, Text, TouchableHighlight, Dimensions, StyleSheet, Linking, Alert, Platform, ActionSheetIOS} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {logout} from '../helpers/auth'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
    backgroundColor: colors.snowWhite
  }
})

class Row extends React.Component {
  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={this.props.destination}>
        <View style={{width: dims.width * 0.725, padding: 10, paddingLeft: 14, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
          <EvilIcons name={this.props.icon} size={30} color={colors.accent} />
          <Text style={{color: colors.accent, fontWeight: '400', fontSize: 17, paddingLeft: 10, paddingBottom: 2}}>
            {this.props.title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class SideMenu extends React.Component {
  constructor(props) {
    super(props)

    this.config = {
      rows: [
        {
          title: 'Bank Accounts',
          icon: 'archive',
          destination: Actions.BankAccounts
        },
        {
          title: 'Settings',
          icon: 'gear',
          destination: Actions.Settings
        },
        {
          title: 'FAQ',
          icon: 'question',
          destination: () => {
            let message = "Payper would like to open your web browser. Is that OK?"
            Alert.alert("Wait!", message, [
              {text: 'Cancel', onPress: () => null, style: 'cancel'},
              {text: 'Yes', onPress: () => Linking.openURL("https://www.getpayper.io/faq").catch(err => null)},
            ])
          }
        },
        {
          title: 'Sign Out',
          icon: 'arrow-left',
          destination: () => {
            if (Platform.OS === 'ios') {
              ActionSheetIOS.showActionSheetWithOptions({
                title: "Signed in as Brady Sheridan",
                options: ['Sign out', 'Cancel'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 1
              }, (buttonIndex) => (buttonIndex === 0) ? logout(this.props.currentUser) : null)
            } else {
              let message = "Are you sure you'd like to sign out?"
              Alert.alert("Signed in as Brady Sheridan", message, [
                {text: 'Cancel', onPress: () => null, style: 'cancel'},
                {text: 'Yes', onPress: () => logout(this.props.currentUser)},
              ])
            }
          }
        }
      ]
    }
  }

  render() {
    return(
      <View style={styles.container}>
        {this.config.rows.map((o) => <Row {...o} {...this.props} key={o.title} />)}
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.getIn(['main', 'currentUser'])
  }
}

module.exports = connect(mapStateToProps)(SideMenu)
