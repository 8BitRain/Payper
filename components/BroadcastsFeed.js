import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, ListView, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {
  DynamicList,
  BroadcastPreview,
  BroadcastFeedSectionHeader
} from './'

import db from '../_MOCK_DB'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width
  }
})

class BroadcastsFeed extends React.Component {
  constructor(props) {
    super(props)

    this.broadcasts = {
      "Friends": {},
      "Local": {},
      "Global": {}
    }

    this.formatBroadcasts()
  }

  formatBroadcasts() {
    let data = this.props.currentUser.broadcastFeed
    let buffer = this.props.currentUser.broadcastFeed.split(",")
    
    for (var i = 0; i < buffer.length; i++) {
      let cid = buffer[i]
      let sectionHeader = db.broadcasts[cid]
      this.broadcasts.Global[cid] = db.broadcasts[cid]
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          data={this.broadcasts}
          afterRemove={() => alert("Removed!")}
          induceRef={(ref) => this.setState({paymentListRef: ref})}
          renderRow={(rowData, sectionID, rowID) => <BroadcastPreview broadcastData={rowData} />}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />} />
      </View>
    )
  }
}

module.exports = BroadcastsFeed
