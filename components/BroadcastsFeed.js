import React from 'react'
import {firebase} from '../helpers'
import {View, Text, StyleSheet, TouchableHighlight, ListView, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {
  DynamicList,
  BroadcastPreview,
  BroadcastFeedSectionHeader
} from './'

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

    this.state = {
      listData: props.currentUser.broadcastFeed
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.broadcastFeed !== this.props.currentUser.broadcastFeed)
      this.setState({listData: nextProps.currentUser.broadcastFeed})
  }

  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          refreshable={true}
          showPullToRefresh={true}
          data={this.state.listData}
          afterRemove={() => alert("Removed!")}
          induceRef={(ref) => this.setState({paymentListRef: ref})}
          renderRow={(rowData, sectionID, rowID) => <BroadcastPreview {...rowData} />}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />} />
      </View>
    )
  }
}

module.exports = BroadcastsFeed
