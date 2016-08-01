// Dependencies
import React from 'react';
import  {View, Text, ListView, RecyclerViewBackedScrollView } from 'react-native';

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
    console.log("Notification array from main state:\n\n", this.props.notifications);
  }


  // Generate rows for the list view
  _genRows() {
    var notifications = this.props.notifications;

    // Check for empty state
    if (notifications.length == 0) {
      this.setState({empty: true});
      return;
    }

    // Attach timestamp to notification object
    for (var ts in notifications) {
      notifications[ts].ts = ts;
    }

    // Sort notifications by timestamp
    notifications.sort(function(a, b) {
      return parseFloat(b.ts) - parseFloat(a.ts);
    });

    // Set state, triggering re-rerender of list
    this.setState({dataSource: this.state.dataSource.cloneWithRows(notifications)});
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
        <Text style={{fontSize: 18, color: colors.darkGrey}}>No notifications</Text>
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
        Lambda.seeNotification({timestamp: row.ts, token: this.props.currentUser.uid}, (response) => {
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
