import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Dimensions} from 'react-native'
import {DynamicList} from './'
import {WantOwnRow} from './Interests'
import {ExploreFeedEmptyState} from './EmptyStates'
import {colors} from '../globalStyles'
import {connect} from 'react-redux'
import * as dispatchers from '../scenes/Main/MainState'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dims.width,
    backgroundColor: colors.lightGrey,
    alignItems: 'center'
  }
})

class ExploreFeed extends React.Component {
  render() {
    return(
      <View style={styles.container}>

        <DynamicList
          shouldAnimateIn={false}
          data={this.props.currentUser.services || []}
          renderRow={(rowData, sectionID, rowID) => {
            for (var k in rowData) if (!rowData[k]) return <View />
            
            return(
              <View style={{width: dims.width, alignItems: 'center'}}>
                <WantOwnRow data={rowData} />
              </View>
            )
          }}
          renderEmptyState={() => <ExploreFeedEmptyState />}
          renderFooter={() => <View style={{height: 100}} />} />

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

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExploreFeed)
