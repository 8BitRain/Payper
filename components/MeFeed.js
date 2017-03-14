import React from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'
import {JoinedBroadcastPreview, AdminBroadcastPreview} from './Broadcasts'
import {DynamicList, BroadcastFeedSectionHeader} from './'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width
  }
})

class MeFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>
        <DynamicList
          shouldAnimateIn={false}
          data={this.props.currentUser.meFeed || {}}
          renderRow={(rowData, sectionID, rowID) => {
            if (sectionID === "My Subscriptions")
              return <JoinedBroadcastPreview broadcast={rowData} />
            if (sectionID === "My Broadcasts")
              return <AdminBroadcastPreview broadcast={rowData} />
          }}
          renderSectionHeader={(rowData, sectionID) => <BroadcastFeedSectionHeader sectionID={sectionID} />} />
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
