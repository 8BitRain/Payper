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
  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          refreshable={true}
          showPullToRefresh={true}
          shouldAnimateIn={false}
          data={this.props.currentUser.broadcastsFeed || []}
          afterRemove={() => alert("Removed!")}
          renderRow={(rowData, sectionID, rowID) => {
            let numCards = Object.keys(this.props.currentUser.broadcastsFeed[sectionID]).length
            let thisIsLastCard = parseInt(rowID) === numCards - 1
            return(
              <View style={{marginBottom: (thisIsLastCard) ? 10 : 0}}>
                <CastCard broadcast={rowData} />
              </View>
            )
          }}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => <BroadcastFeedEmptyState />}
          renderFooter={() => <View style={{height: 25}} />} />
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
