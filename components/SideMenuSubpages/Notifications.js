import React from 'react'
import { View, Text, ListView, RecyclerViewBackedScrollView } from 'react-native'
import * as Lambda from "../../services/Lambda"
import { colors } from '../../globalStyles'
import Notification from '../../components/Notification/Notification.js'

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      user: {},
      empty: true,
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
    }
  }

  componentDidMount() {
    this._genRows()
  }

  _genRows() {
    if (!this.props.currentUser.notifications || this.props.currentUser.notifications.length == 0) return

    // Put notifications in array format, tacking on timestamp as a key/value pair for sorting
    var notifications = []
    for (var timestamp in this.props.currentUser.notifications) {
      this.props.currentUser.notifications[timestamp].ts = timestamp
      notifications.push(this.props.currentUser.notifications[timestamp])
    }

    // Sort notifications by timestamp
    notifications.sort(function(a, b) {
      return parseFloat(b.ts) - parseFloat(a.ts)
    })

    // Set state, triggering re-rerender of list, then mark unseen notifications as seen
    this.setState({
      empty: false,
      dataSource: this.state.dataSource.cloneWithRows(notifications)
    })

    // Mark unseen notifications as seen
    this._seeNotifications()
  }

  // Return a list of ready to render rows
  _renderRow(n) {
    return(
      <Notification notification={n} />
    )
  }

  // Returns a ready-to-render notification ListView
  _getNotificationList() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.snowWhite}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    )
  }

  /**
    *   Returns a ready-to-render empty state view
  **/
  _getEmptyState() {
    return(
      <View style={{flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.snowWhite}}>
        <Text style={{fontSize: 18, color: colors.deepBlue}}>No notifications</Text>
      </View>
    )
  }

  /**
    *   Mark unseen notifications as seen
  **/
  _seeNotifications() {
    Lambda.seeNotifications({ token: this.props.currentUser.token }, (res) => {
      console.log("Lambda.seeNotifications() response:", response)
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.snowWhite}}>
        {(this.state.empty) ? this._getEmptyState() : this._getNotificationList()}
      </View>
    )
  }
}

module.exports = Notifications
