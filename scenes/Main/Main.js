import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
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
    padding: 14
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: "Broadcasts"
    }

    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then(token => {
      console.log("FCM Token: " + token);
      console.log("FB Token: " + this.props.currentUser.token);
        let data = {
          token: this.props.currentUser.token,
          FCMToken: token
        }
        updateFCMToken(data, (callback) =>{
        console.log("Callback: ", callback);
        FCM.presentLocalNotification({
             id: "My First Notification",                               // (optional for instant notification)
             title: "First Notification Evaa",                     // as FCM payload
             body: "This is a notification, wild huh",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        });



            // store fcm token in your server
        });

        try{
          this.notificationListener = FCM.on('notification', (notif) => {
         // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
         console.log(notif);
         try{
           FCM.presentLocalNotification({                          // (optional for instant notification)
                title: notif.aps.alert.title,                     // as FCM payload
                body: notif.aps.alert.body,                    // as FCM payload (required)
                sound: "default",                                   // as FCM payload
                priority: "high",                                   // as FCM payload
                click_action: "ACTION",                             // as FCM payload
                badge: 0,                                          // as FCM payload IOS only, set 0 to clear badges
                large_icon: "ic_launcher",                           // Android only
                icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
                my_custom_data:'my_custom_field_value',             // extra data you want to throw
                lights: true,                                       // Android only, LED blinking (default false)
                show_in_foreground: true
            });
         }catch(err){
           console.log("Notification Error: " + err)
         }

         if(notif.local_notification){
           //this is a local notification
         }
         if(notif.opened_from_tray){
           //app is open/resumed because user clicked banner
         }

        });
        } catch(err){
          console.log("Notification Error", err);
        }


        try{
          this.refreshTokenListener = FCM.on('refreshToken', (token) => {
              console.log(token)
              // fcm token may not be available on first load, catch it here
          });
        } catch(err){
          console.log("RefreshTokenListener Error", err);
        }





  }

  testPushNotif(notif){
    switch (notif_num) {
      case "payment_renewal":
      FCM.presentLocalNotification({
           id: "payment_renewal",                               // (optional for instant notification)
           title: "Your payment in [cast] is being renewed",                     // as FCM payload
           body: "",                    // as FCM payload (required)
           sound: "default",                                   // as FCM payload
           priority: "high",                                   // as FCM payload
           click_action: "ACTION",                             // as FCM payload
           badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
           large_icon: "ic_launcher",                           // Android only
           icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
           my_custom_data:'my_custom_field_value',             // extra data you want to throw
           lights: true,                                       // Android only, LED blinking (default false)
           show_in_foreground: true
       });
        break;
      case "user_joined_broadcast":
      FCM.presentLocalNotification({
           id: "user_joined_broadcast",                               // (optional for instant notification)
           title: "[Name] has joined your cast for [cast]",                     // as FCM payload
           body: "",                    // as FCM payload (required)
           sound: "default",                                   // as FCM payload
           priority: "high",                                   // as FCM payload
           click_action: "ACTION",                             // as FCM payload
           badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
           large_icon: "ic_launcher",                           // Android only
           icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
           my_custom_data:'my_custom_field_value',             // extra data you want to throw
           lights: true,                                       // Android only, LED blinking (default false)
           show_in_foreground: true
       });
        break;
      case "user_left_broadcast":
      FCM.presentLocalNotification({
           id: "user_left_broadcast",                               // (optional for instant notification)
           title: "[user] has left your broadcast [cast]",                     // as FCM payload
           body: "This is a notification, wild huh",                    // as FCM payload (required)
           sound: "default",                                   // as FCM payload
           priority: "high",                                   // as FCM payload
           click_action: "ACTION",                             // as FCM payload
           badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
           large_icon: "ic_launcher",                           // Android only
           icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
           my_custom_data:'my_custom_field_value',             // extra data you want to throw
           lights: true,                                       // Android only, LED blinking (default false)
           show_in_foreground: true
       });
        break;
      case "removed_from_broadcast":
      FCM.presentLocalNotification({
           id: "removed_from_broadcast",                               // (optional for instant notification)
           title: "You have been removed from [broadcast]",                     // as FCM payload
           body: "",                    // as FCM payload (required)
           sound: "default",                                   // as FCM payload
           priority: "high",                                   // as FCM payload
           click_action: "ACTION",                             // as FCM payload
           badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
           large_icon: "ic_launcher",                           // Android only
           icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
           my_custom_data:'my_custom_field_value',             // extra data you want to throw
           lights: true,                                       // Android only, LED blinking (default false)
           show_in_foreground: true
       });
        break;
      case "microdeposits":
      FCM.presentLocalNotification({
           id: "microdeposits",                               // (optional for instant notification)
           title: "Microdeposits initiated/posted",                     // as FCM payload
           body: "",                    // as FCM payload (required)
           sound: "default",                                   // as FCM payload
           priority: "high",                                   // as FCM payload
           click_action: "ACTION",                             // as FCM payload
           badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
           large_icon: "ic_launcher",                           // Android only
           icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
           my_custom_data:'my_custom_field_value',             // extra data you want to throw
           lights: true,                                       // Android only, LED blinking (default false)
           show_in_foreground: true
       });
        break;
      case "kyc_document_uploaded":
        FCM.presentLocalNotification({
             id: "kyc_document_uploaded",                               // (optional for instant notification)
             title: "Your document has been uploaded",                     // as FCM payload
             body: "This is a notification, wild huh",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "kyc_document_processed":
        FCM.presentLocalNotification({
             id: "kyc_document_processed",                               // (optional for instant notification)
             title: "Your document is being processed",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "kyc_document_failed":
        FCM.presentLocalNotification({
             id: "kyc_document_failed",                               // (optional for instant notification)
             title: "Your document failed to be uploaded",                     // as FCM payload
             body: "This is a notification, wild huh",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "kyc_document_success":
        FCM.presentLocalNotification({
             id: "kyc_document_success",                               // (optional for instant notification)
             title: "Your document succeeded",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "hidden_info_edited":
        FCM.presentLocalNotification({
             id: "hidden_info_edited",                               // (optional for instant notification)
             title: "Hidden info was edited in [cast]",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "payment_failed":
        FCM.presentLocalNotification({
             id: "payment_failed",                               // (optional for instant notification)
             title: "Your payment to [name] in [cast] failed",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "happy_birthday":
        FCM.presentLocalNotification({
             id: "happy_birthday",                               // (optional for instant notification)
             title: "Happy Birthday [Name]",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;
      case "friend_broadcasting":
        FCM.presentLocalNotification({
             id: "friend_broadcasting",                               // (optional for instant notification)
             title: "Your Friend [Name] is broadcasting",                     // as FCM payload
             body: "",                    // as FCM payload (required)
             sound: "default",                                   // as FCM payload
             priority: "high",                                   // as FCM payload
             click_action: "ACTION",                             // as FCM payload
             badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
             large_icon: "ic_launcher",                           // Android only
             icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
             my_custom_data:'my_custom_field_value',             // extra data you want to throw
             lights: true,                                       // Android only, LED blinking (default false)
             show_in_foreground: true
         });
        break;



    }
  }

  componentWillMount() {
    this.props.currentUser.startListeningToFirebase((updates) => this.props.updateCurrentUser(updates));

  }

  componentWillUnmount(){
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  componentWillReceiveProps(nextProps) {

    // Handle tab switching
    if (nextProps.newTab && !this.state.changingTab) {
      this.setState({
        changingTab: true,
        activeTab: nextProps.newTab
      }, () => Actions.refresh({newTab: null}))
    }

    if (null === nextProps.newTab && this.state.changingTab) {
      this.setState({changingTab: false})
    }

  }

  changeTab(newTab) {
    if (newTab === this.state.activeTab) return
    this.setState({activeTab: newTab})
  }

  render() {
    return (
      <View style={{flex: 1}}>

        { /* Header */ }
        <Header activeTab={this.state.activeTab} changeTab={this.changeTab} {...this.props} showSideMenuButton showTabBar />

        { /* Inner content */ }
        <View style={styles.container}>
          {this.state.activeTab === "Broadcasts"  ? <BroadcastsFeed {...this.props} />  : null}
          {this.state.activeTab === "Explore"     ? <ExploreFeed {...this.props} />     : null}
          {this.state.activeTab === "Me"          ? <MeFeed {...this.props} />          : null}
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
