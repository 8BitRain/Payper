import React from 'react';
import { View, Text, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView, TouchableHighlight, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton
} = FBSDK;

// Helper functions
import * as Async from '../../helpers/Async';
import * as Partials from '../../helpers/Partials';
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

    console.log("%cProps received by settings:", "color:blue;font-weight:900;");
    console.log(this.props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([
        {rowTitle: "Home", iconName: "home", destination: () => this.props.changePage("payments")},
        {rowTitle: "Notifications", iconName: "light-bulb", destination: () => this.props.changePage("notifications")},
        {rowTitle: "Funding Sources", iconName: "line-graph", destination: () => this.props.changePage("fundingSources")},
        {rowTitle: "FAQ", iconName: "help-with-circle", destination: Actions.CreateAccountViewContainer},
        {rowTitle: "Sign Out", iconName: "moon", destination: Init.signOut},
      ]),
    }
  }


  componentDidMount() {
    console.log("Props received by SettingsView:", this.props);
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
          onLogoutFinished={() => Init.signOut()} />
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

            { /* Render unseen notifications indicator */ }
            { (options.rowTitle == "Notifications")
                ? (this.props.numUnseenNotifications == 0)
                  ? null
                  : <View style={[notificationStyles.numNotificationsWrap, { bottom: 6 }]}>
                      <Text style={notificationStyles.numNotificationsText}>{ this.props.numUnseenNotifications }</Text>
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
          onPress={() => console.log("EDIT PROFILE")}
          style={{borderBottomWidth: 0.5, borderBottomColor: colors.accent}}>

          <View style={{height: 70, marginTop: 30, paddingBottom: 12.5, paddingLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.accent}}>
            { Partials.getUserPic(this.props.currentUser.profile_pic, this.props.currentUser.first_name + " " + this.props.currentUser.last_name) }

            <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={[styles.rowTitle, {fontSize: 18, paddingLeft: 0, paddingRight: 12}]}>{ this.props.currentUser.first_name + " " + this.props.currentUser.last_name }</Text>
              <Text style={[styles.rowTitle, {fontSize: 12, color: colors.accent, paddingLeft: 0}]}>Edit profile</Text>
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
