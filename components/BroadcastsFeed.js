import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'
import {UnjoinedBroadcastPreview} from './Broadcasts'
import {
  DynamicList,
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
  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          refreshable={true}
          showPullToRefresh={true}
          data={this.props.currentUser.broadcastFeed || {}}
          afterRemove={() => alert("Removed!")}
          renderRow={(rowData, sectionID, rowID) => <UnjoinedBroadcastPreview broadcast={rowData} />}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => <BroadcastFeedEmptyState />} />
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(BroadcastsFeed)
