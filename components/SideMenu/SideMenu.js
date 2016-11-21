import React from 'react'
import { View, Text, TouchableHighlight, Image, Dimensions, StyleSheet, Linking, Alert } from 'react-native'
import { colors } from '../../globalStyles'
import { VibrancyView } from 'react-native-blur'
import { signout } from '../../auth'
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

    let { toggleSideMenuSubpage, currentUser } = this.props

    this.state = {
      options: [
        {
          title: 'Bank Accounts',
          icon: 'archive',
          destination: () => toggleSideMenuSubpage("Bank Accounts")
        },
        {
          title: 'Notifications',
          icon: 'bell',
          numericIndicator: currentUser.appFlags.numUnseenNotifications,
          destination: () => toggleSideMenuSubpage("Notifications")
        },
        {
          title: 'Invite a Friend',
          icon: 'envelope',
          destination: () => toggleSideMenuSubpage("Invite a Friend")
        },
        // {
        //   title: 'Settings',
        //   icon: 'gear',
        //   destination: () => toggleSideMenuSubpage("Settings")
        // },
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
          title: 'Signout',
          icon: 'arrow-left',
          destination: () => {
            let message = "Are you sure you'd like to sign out?"
            Alert.alert("Wait!", message, [
              {text: 'Cancel', onPress: () => null, style: 'cancel'},
              {text: 'Yes', onPress: () => signout(this.props.currentUser)},
            ])
          }
        }
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("<SideMenu /> will receive props", nextProps)
  }

  render() {
    let { toggleSideMenuSubpage } = this.props
    let { first_name, last_name, username, profile_pic } = this.props.currentUser
    let name = first_name + " " + last_name
    let initialsBuffer = name.split(" ").map((name) => name.charAt(0))
    let initials = initialsBuffer.join("")

    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 10, backgroundColor: colors.snowWhiteOpaque}}>
        <VibrancyView blurType={"light"} style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />

        { /* Header (opens profile page) */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => toggleSideMenuSubpage("My Profile")}>
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
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

module.exports = SideMenu
