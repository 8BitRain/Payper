// Dependencies
import React from 'react';
import {View, Text, ListView, RecyclerViewBackedScrollView, RefreshControl} from 'react-native';

// Helper functions
import * as Firebase from "../../services/Firebase";
import * as Async from "../../helpers/Async";

// Custom stylesheets
import colors from "../../styles/colors";

// Partial components
import Header from '../../components/Header/Header.js';
import Notification from '../../components/Notification/Notification.js';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      empty: true,
      dataSource: ds.cloneWithRows([]),

      // Props to be passed to the Header
      headerProps: {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": true,
        },
        index: null,
        numCircles: null,
      },
    }

    // Initialize Firebase listeners on this user's notifications
    Async.get('user', (user) => {
      Firebase.listenToNotifications(JSON.parse(user).uid, (snapshot) => {
        this._genRows(snapshot);
      });
    });
  }


  /**
    *   Add new notification rows
  **/
  _genRows(snapshot) {
    if (snapshot) this.setState({empty: false});
    var notifications = [];

    // Attach timestamp to notification object, append it to notifications array
    for (var timestamp in snapshot) {
      snapshot[timestamp].ts = timestamp;
      notifications.push(snapshot[timestamp]);
    }

    // Sort notifications by timestamp
    notifications.sort(function(a, b) {
      return parseFloat(a.ts) - parseFloat(b.ts);
    });

    // Set state, triggering re-rerender of list
    this.setState({dataSource: this.state.dataSource.cloneWithRows(notifications)});
  }


  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(n) {
    return(
      <Notification notification={n} />
    );
  }


  /**
    *   TODO:
    *   Implement actual refresh events here
  **/
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 750);
  }


  /**
    *   Returns a ready-to-render notification ListView
  **/
  _getNotificationList() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.white}}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={[colors.darkGrey]}
              tintColor={colors.darkGrey}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    );
  }


  /**
    *   Returns a ready-to-render empty state view
  **/
  _getEmptyState() {
    return(
      <View style={{flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
        <Text style={{fontSize: 18, color: colors.darkGrey}}>No notifications{"\n"}:(</Text>
      </View>
    );
  }


  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        { /* Render list of notifications or empty state */  }
        {(this.state.empty) ? this._getEmptyState() : this._getNotificationList() }
      </View>
    );
  }
}

export default Notifications;
