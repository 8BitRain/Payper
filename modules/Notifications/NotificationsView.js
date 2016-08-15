// Dependencies
import React from 'react';
import { View, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

// Helper functions
import * as Lambda from "../../services/Lambda";

// Custom stylesheets
import colors from "../../styles/colors";

// Partial components
import Notification from '../../components/Notification/Notification.js';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      user: {},
      empty: true,
      dataSource: ds.cloneWithRows([]),
    };
  }


  componentDidMount() {
    this._genRows();
    console.log("Props in NotificationsView:\n\n", this.props);
  }


  // Generate rows for the list view
  _genRows() {
    if (!this.props.notifications || this.props.notifications.length == 0) return;

    // Put notifications in array format, tacking on timestamp as a key/value pair for sorting
    var notifications = [];
    for (var timestamp in this.props.notifications) {
      this.props.notifications[timestamp].ts = timestamp;
      notifications.push(this.props.notifications[timestamp]);
    }

    // Sort notifications by timestamp
    notifications.sort(function(a, b) {
      return parseFloat(b.ts) - parseFloat(a.ts);
    });

    // Set state, triggering re-rerender of list, then mark unseen notifications as seen
    this.setState({ empty: false, dataSource: this.state.dataSource.cloneWithRows(notifications) }, () => this._seeNotifications());
  }


  //  Return a list of ready to render rows
  _renderRow(n) {
    return(
      <Notification notification={n} />
    );
  }


  // Returns a ready-to-render notification ListView
  _getNotificationList() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.white}}>
        <ListView
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
        <Text style={{fontSize: 18, color: colors.richBlack}}>No notifications</Text>
      </View>
    );
  }


  /**
    *   Mark unseen notifications as seen
  **/
  _seeNotifications() {
    for (var i = 0; i < this.state.dataSource.getRowCount(); i++) {
      var row = this.state.dataSource.getRowData(0, i)
      if (!row.seen) {
        row.seen = true;
        Lambda.seeNotification({timestamp: row.ts, token: this.props.currentUser.token}, (response) => {
          console.log("Lambda.seeNotification() response:", response);
        });
      }
    }
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
