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

    this.data = {}
    this.data["Global"] = [
      {
        amount: 3,
        casterID: 'id',
        createdAt: 1488505717125,
        detailsOfAgreement: "Deets",
        freq: "MONTHLY",
        memberLimit: 3,
        memberIDs: "",
        open: true,
        renewal: true,
        secret: "ENCRYPTED",
        tag: "Netflix",
        title: "Netflix (4 Screens)",
        type: "World",
        caster: {
          profilePic: "https://scontent.xx.fbcdn.net/v/t1.0-9/16143358_10210550866041053_2832379559133583479_n.jpg?oh=176f414ab2158cbd39ef28647023e533&oe=59340143",
          username: "@Eric-Smith",
          firstName: "Eric",
          lastName: "Smith"
        }
      },
      {
        amount: 7,
        casterID: 'id',
        createdAt: 1488505717125,
        detailsOfAgreement: "Deets",
        freq: "MONTHLY",
        memberLimit: 2,
        memberIDs: "",
        open: true,
        renewal: true,
        secret: "ENCRYPTED",
        tag: "Tidal",
        title: "Tidal HiFi",
        type: "World",
        caster: {
          profilePic: "https://pbs.twimg.com/profile_images/588854250391863296/EKUaM8dC.jpg",
          username: "@Mohsin-Khan",
          firstName: "Mohsin",
          lastName: "Khan"
        }
      },
      {
        amount: 2,
        casterID: 'id',
        createdAt: 1488505717125,
        detailsOfAgreement: "Deets",
        freq: "WEEKLY",
        memberLimit: 1,
        memberIDs: "",
        open: true,
        renewal: true,
        secret: "ENCRYPTED",
        tag: "nyt",
        title: "New York Times",
        type: "World",
        caster: {
          profilePic: "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/17022387_1372970839390041_35582023932744800_n.jpg?oh=8b8e3db2a5ebf88078d02d6dd69b624e&oe=596C7172",
          username: "@Brady-Sheridan",
          firstName: "Brady",
          lastName: "Sheridan"
        }
      }
    ]
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
