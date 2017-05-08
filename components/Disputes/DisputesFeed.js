import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {DynamicList} from '../'
import {DisputesFeedEmptyState} from '../EmptyStates'
import {colors} from '../../globalStyles'
import {DisputesFeedRow} from './'
import {connect} from 'react-redux'
import * as dispatchers from '../../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.lightGrey
  }
})

class DisputesFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          refreshable={true}
          showPullToRefresh={true}
          shouldAnimateIn={false}
          data={this.props.currentUser.disputesFeed || []}
          renderRow={(rowData, sectionID, rowID) => <DisputesFeedRow dispute={rowData} />}
          renderEmptyState={() => <DisputesFeedEmptyState />}
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(DisputesFeed)
