import React from 'react';
import { View, Text, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView, TouchableHighlight, Dimensions, Linking, ActionSheetIOS } from 'react-native';
import { Actions } from 'react-native-router-flux';
const FBSDK = require('react-native-fbsdk');
const { LoginButton } = FBSDK;

// Helper functions
import * as Async from '../../helpers/Async';
import * as Partials from '../../helpers/Partials';
import * as Alert from '../../helpers/Alert';
import * as Init from '../../_init';

// Custom stylesheets
import colors from '../../styles/colors';
import styles from '../../styles/Settings/Settings';
import notificationStyles from '../../styles/Notifications/Preview';
const dimensions = Dimensions.get('window');

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.sideMenuButtons = [
      {rowTitle: "Home", iconName: "home", destination: () => this.props.changePage("payments")},
      {rowTitle: "Notifications", iconName: "light-bulb", destination: () => this.props.changePage("notifications")},
      {rowTitle: "Bank Accounts", iconName: "wallet", destination: () => this.props.changePage("fundingSources")},
      {rowTitle: "Invite", iconName: "users", destination: () => this.props.changePage("invite")},
      {rowTitle: "FAQ", iconName: "help-with-circle", destination: () => {
        Alert.confirmation({
          title: "Alert",
          message: "Payper would like to open Safari. Is that OK?",
          cancelMessage: "Nevermind",
          confirmMessage: "Yes",
          cancel: () => console.log("Nevermind"),
          confirm: () => Linking.openURL("https://www.getpayper.io/faq").catch(err => console.error('An error occurred', err)),
        });
      }},
      {rowTitle: "Log Out", iconName: "moon", destination: () => {
        ActionSheetIOS.showActionSheetWithOptions({
          title: "Signed in as " + this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
          options: ['Sign out', 'Cancel'],
          cancelButtonIndex: 1
        }, (buttonIndex) => {
          if (buttonIndex == 0) { this.props.currentUser.logout(); }
        });
      }},
    ];

    this.state = {
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows(this.sideMenuButtons),
    };

    console.log("Constructing <SettingsView /> with this.props.currentUser:", this.props.currentUser);
  }

  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(options) {

    { /* If user is signed in with Facebook, display Facebook sign out button */ }
    if (options.rowTitle == "Sign Out" && this.props.currentUser.provider == "facebook") {
      return(
        <LoginButton
          style={[styles.row, {marginLeft: 15, marginRight: 15, height: 40}]}
          onLogoutFinished={() => this.props.signout()} />
      );
    } else {
      return(
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor={'transparent'}
          onPress={() => options.destination()}>
          <View style={styles.row}>

            <Entypo style={styles.icon} name={options.iconName} size={20} color={colors.accent} />
            <Text style={styles.rowTitle}>{ options.rowTitle }</Text>

            { /* Render unseen notifications indicator */
              (options.rowTitle == "Notifications")
                ? (this.props.currentUser.appFlags && this.props.currentUser.appFlags.numUnseenNotifications === 0 || !this.props.currentUser.appFlags.numUnseenNotifications)
                  ? null
                  : <View style={[notificationStyles.numNotificationsWrap, { bottom: 6 }]}>
                      <Text style={notificationStyles.numNotificationsText}>{ this.props.currentUser.appFlags.numUnseenNotifications }</Text>
                    </View>
                : null }

          </View>
        </TouchableHighlight>
      );
    }
  }


  /**
    *   Returns a ready-to-render payment ListView
  **/
  _getSettingsList() {
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        enableEmptySections />
    );
  }


  render() {
    return (
      <View style={{flex: 1.0, backgroundColor: colors.richBlack}}>

        { /* Header */ }
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor={'transparent'}
          onPress={() => this.props.changePage("profile")}
          style={{borderBottomWidth: 0.5, borderBottomColor: colors.accent}}>

          <View style={{height: 70, marginTop: 30, paddingBottom: 12.5, paddingLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.accent}}>
            { Partials.getUserPic(this.props.currentUser.profile_pic, this.props.currentUser.first_name + " " + this.props.currentUser.last_name) }

            <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={[styles.rowTitle, {fontSize: 18, paddingLeft: 0, paddingRight: 12}]}>{ this.props.currentUser.first_name + " " + this.props.currentUser.last_name }</Text>
              <Text style={[styles.rowTitle, {fontSize: 12, color: colors.accent, paddingLeft: 0}]}>My Profile</Text>
            </View>
          </View>
        </TouchableHighlight>

        { /* ListView */ }
        { this._getSettingsList() }

      </View>
    );
  }
}

export default Settings;
