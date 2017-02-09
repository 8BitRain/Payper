import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableHighlight, Image, Dimensions, StyleSheet, Linking, Alert, ActionSheetIOS, Platform } from 'react-native'
import { colors } from '../../globalStyles'
import { VibrancyView } from 'react-native-blur'
import { signout } from '../../auth'
import { TrackOnce } from '../../classes/Metrics'
import { BankAccounts, Notifications, MyProfile } from '../SideMenuSubpages'
import { TrendingPayments } from '../index'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

let dims = Dimensions.get('window')
let imageDims = {
  width: dims.width * 0.15,
  height: dims.width * 0.15,
}

class Row extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { title, icon, destination, numericIndicator } = this.props

    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={destination}>
        <View style={{width: dims.width * 0.725, padding: 10, paddingLeft: 14, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}}>
          <EvilIcons name={icon} size={30} color={colors.accent} />
          <Text style={{color: colors.accent, fontWeight: '400', fontSize: 17, paddingLeft: 10, paddingBottom: 2}}>
            {title}
          </Text>

          { /* Numeric indicator */
            (numericIndicator)
              ? <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, paddingRight: 15, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 14, padding: 2, paddingLeft: 8, paddingRight: 8, borderRadius: 4, backgroundColor: colors.gradientGreen, color: colors.snowWhite, overflow: 'hidden'}}>
                    {numericIndicator}
                  </Text>
                </View>
              : null }
        </View>
      </TouchableHighlight>
    )
  }
}

class SideMenu extends React.Component {
  constructor(props) {
    super(props)

    let { currentUser } = this.props
    let trackOnce = new TrackOnce()

    this.state = {
      options: [
        {
          title: 'Bank Accounts',
          icon: 'archive',
          destination: () => Actions.GlobalModal({
            subcomponent: <BankAccounts {...this.props} />,
            showHeader: true,
            title: "Bank Accounts"
          })
        },
        {
          title: 'Notifications',
          icon: 'bell',
          numericIndicator: (currentUser.appFlags) ? currentUser.appFlags.numUnseenNotifications : 0,
          destination: () => Actions.GlobalModal({
            subcomponent: <Notifications {...this.props} />,
            showHeader: true,
            title: "Notifications"
          })
        },
        {
          title: 'Trending Payments',
          icon: 'chart',
          destination: () => {
            Actions.GlobalModal({
              subcomponent: <TrendingPayments />,
              showHeader: true,
              title: "Trending Payments"
            })
            trackOnce.report("buttonPress/trendingPayments", currentUser.uid, { from: "side menu"})
          }
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
                title: "Signed in as " + this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
                options: ['Sign out', 'Cancel'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 1
              }, (buttonIndex) => (buttonIndex === 0) ? signout(this.props.currentUser) : null)
            } else {
              let message = "Are you sure you'd like to sign out?"
              Alert.alert("Wait!", message, [
                {text: 'Cancel', onPress: () => null, style: 'cancel'},
                {text: 'Yes', onPress: () => Linking.openURL("https://www.getpayper.io/faq").catch(err => null)},
              ])
            }
          }
        }
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.appFlags && nextProps.currentUser.appFlags.numUnseenNotifications !== this.props.currentUser.appFlags.numUnseenNotifications) {
      for (var o in this.state.options) {
        let curr = this.state.options[o]
        if (curr.title === "Notifications") {
          let { numUnseenNotifications } = nextProps.currentUser.appFlags
          curr.numericIndicator = numUnseenNotifications
        }
      }
    }
  }

  render() {
    let { first_name, last_name, username, profile_pic } = this.props.currentUser
    let name = first_name + " " + last_name
    let initialsBuffer = name.split(" ").map((name) => name.charAt(0))
    let initials = initialsBuffer.join("")

    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, backgroundColor: "rgba(255, 251, 252, 0.8)"}}>
        <VibrancyView blurType={"light"} style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />

        { /* Header (opens profile page) */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => Actions.GlobalModal({
            subcomponent: <MyProfile {...this.props} />,
            showHeader: true,
            title: "My Profile"
          })}>
          <View style={{flexDirection: 'row', padding: 20, alignItems: 'center'}}>
            <View style={styles.imageWrap}>
              {(profile_pic)
                ? <Image style={{width: 48, height: 48, borderRadius: 24}} source={{uri: profile_pic}} />
                : <View style={{width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
                      {initials}
                    </Text>
                  </View> }
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center', paddingLeft: 12}}>
              <Text style={{fontSize: 18, color: colors.maastrichtBlue}}>
                {name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 14, color: colors.accent}}>
                  {"Edit my profile"}
                </Text>
                <EvilIcons name={"chevron-right"} color={colors.accent} size={20} style={{paddingLeft: -3, paddingTop: 1}} />
              </View>
            </View>
          </View>
        </TouchableHighlight>

        { /* Rows */ }
        { this.state.options.map((o) => <Row {...o} {...this.props} key={Math.random()} />) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageWrap: {
    width: imageDims.width,
    height: imageDims.height,
    borderRadius: imageDims.width / 2,
    borderWidth: 1,
    borderColor: colors.slateGrey,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

module.exports = SideMenu
