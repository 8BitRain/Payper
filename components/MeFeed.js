import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {MeFeedEmptyState} from './EmptyStates'
import {SubscriptionCard, AdminCard} from './Broadcasts'
import {DynamicList, BroadcastFeedSectionHeader, StatusCard} from './'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.lightGrey
  }
})

class MeFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          shouldAnimateIn={false}
          data={this.props.currentUser.meFeed || []}
          renderRow={(rowData, sectionID, rowID) => {
            let numRows = Object.keys(this.props.currentUser.meFeed[sectionID] || {}).length
            let isLastRow = parseInt(rowID) === numRows - 1

            if (sectionID === "My Subscriptions")
              return(
                <View style={{marginBottom: (isLastRow) ? 10 : 0}}>
                  <SubscriptionCard broadcast={rowData} />
                </View>
              )

            if (sectionID === "My Broadcasts")
              return(
                <View style={{marginBottom: (isLastRow) ? 10 : 0}}>
                  <AdminCard broadcast={rowData} currentUser={this.props.currentUser} />
                </View>
              )

            return <View />
          }}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />}
          renderEmptyState={() => (this.props.currentUser.appFlags.onboardingProgress && this.props.currentUser.appFlags.onboardingProgress.indexOf("kyc-success") <= 0) ? null : <MeFeedEmptyState />}
          renderFooter={() => <View style={{height: 100}} />}
          renderHeader={() => <StatusCard currentUser={this.props.currentUser} />} />
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(MeFeed)
