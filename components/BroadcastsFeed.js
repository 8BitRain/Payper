import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'
import {CastCard} from './Broadcasts'
import {BroadcastFeedEmptyState} from './EmptyStates'
import {DynamicList, BroadcastFeedSectionHeader} from './'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.lightGrey
  }
})

class BroadcastsFeed extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          refreshable={true}
          showPullToRefresh={true}
          shouldAnimateIn={false}
          data={this.props.currentUser.broadcastsFeed || []}
          afterRemove={() => alert("Removed!")}
          renderRow={(rowData, sectionID, rowID) => <CastCard broadcast={rowData} />}
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
