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
          data={this.props.currentUser.broadcastFeedIDs || []}
          afterRemove={() => alert("Removed!")}
          renderRow={(rowData, sectionID, rowID) => {
            // Return empty view if data needed to render CastCard isn't
            // defined yet
            if (!this.props.currentUser.broadcastData || !this.props.currentUser.broadcastData[rowData])
              return <View />

            let broadcast = this.props.currentUser.broadcastData[rowData] || {}
            let numRows = Object.keys(this.props.currentUser.broadcastFeedIDs[sectionID] || {}).length
            let isLastRow = parseInt(rowID) === numRows - 1

            return(
              <View style={{marginBottom: (isLastRow) ? 10 : 0}}>
                <CastCard broadcast={broadcast} />
              </View>
            )
          }}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => <BroadcastFeedEmptyState />}
          renderFooter={() => <View style={{height: 100}} />}
          refreshButtonWrapStyles={{paddingBottom: 10}} />
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
